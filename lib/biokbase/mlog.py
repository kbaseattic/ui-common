"""
NAME
       mlog

DESCRIPTION
       A library for sending MG-RAST logging to syslog.

METHODS
       mlog(string subsystem, hashref constraints): Initializes mlog. You should call this at the beginning of your program. Constraints are optional.

       logit(int level, string message): sends mgrast log message to syslog.

       *         level: (0-6) The logging level for this message is compared to the logging level that has been set in mlog.  If it is <= the set logging level, the
                 message will be sent to syslog, otherwise it will be ignored.  Logging level is set to 6 if MG-RAST control API cannot be reached and the user does
                 not set the log level. Log level can also be entered as string (e.g. 'DEBUG')

       *          message: This is the log message.

       get_log_level(): Returns the current log level as an integer.

       set_log_level(integer level) : Sets the log level. Only use this if you wish to override the log levels that are defined by the control API. Can also be entered
       as string (e.g. 'DEBUG')

       *          level : priority

       *          0 : EMERGENCY - vital component is down

       *          1 : ALERT - non-vital component is down

       *          2 : ERROR - error that prevents proper operation

       *          3 : WARNING - error, but does not prevent operation

       *          4 : DEBUG - lowest level of debug

       *          5 : DEBUG2 - second level of debug

       *          6 : DEBUG3 - highest level of debug

       set_log_msg_check_count(integer count): used to set the number the messages that mlog will log before querying the control API for the log level (default is 100
       messages).

       set_log_msg_check_interval(integer seconds): used to set the interval, in seconds, that will be allowed to pass before mlog will query the control API for the
       log level (default is 300 seconds).

       update_api_log_level() : Checks the control API for the currently set log level.

       use_api_log_level() : Removes the user-defined log level and tells mlog to use the control API-defined log level.
"""

import json
import urllib2
import syslog
import datetime, re
import inspect, os, getpass, sys

MLOG_CONF_FILE = "/etc/mlog/mlog.conf"
DEFAULT_LOG_LEVEL = 6
LOG_LEVEL_MIN = 0
LOG_LEVEL_MAX = 6
MSG_CHECK_COUNT = 100
MSG_CHECK_INTERVAL = 300 # 300s = 5min
MSG_FACILITY = syslog.LOG_LOCAL1
EMERG_FACILITY = syslog.LOG_LOCAL0
SYSLOG_LEVELS = [ syslog.LOG_EMERG, syslog.LOG_ALERT, syslog.LOG_CRIT, syslog.LOG_ERR,
                  syslog.LOG_WARNING, syslog.LOG_NOTICE, syslog.LOG_INFO, syslog.LOG_DEBUG ]
MLOG_TEXT_TO_LEVEL = { 'EMERGENCY' : 0,
                       'ALERT' : 1,
                       'ERROR' : 2,
                       'WARNING' : 3,
                       'DEBUG' : 4,
                       'DEBUG2' : 5,
                       'DEBUG3' : 6 };
MLOG_LEVELS = [ 'EMERGENCY', 'ALERT', 'ERROR', 'WARNING', 'DEBUG', 'DEBUG2', 'DEBUG3' ];

class mlog(object):
    """
    This class contains the methods necessary for sending MG-RAST log messages.
    """

    def __init__(self, *args):
        if len(args) < 1:
            sys.stderr.write("ERROR: You must define a subsystem when initializing mlog\n")
            return 1

        self.subsystem = args[0]
        self.user_log_level = -1
        self.msg_count = 0
        self.log_constraints = {}

        if len(args) > 1:
            self.log_constraints = args[1]

        self.update_api_log_level()

    def _get_time_since_start(self):
        time_diff = datetime.datetime.now() - self.time_since_api_update
        return ( (time_diff.days * 24 * 60 * 60) + time_diff.seconds )
     
    def get_log_level(self):
        if(self.user_log_level != -1):
            return self.user_log_level
        elif(self.api_log_level != -1):
            return self.api_log_level
        else:
            return DEFAULT_LOG_LEVEL

    def update_api_log_level(self):
        self.api_log_level = -1
        self.msgs_since_api_update = 0
        self.time_since_api_update = datetime.datetime.now()

        # Retrieving the control API defined log level
        api_url = ""
        for line in open(MLOG_CONF_FILE):
            line.strip()
            if(re.match(r'^url\s+', line)):
                api_url = line.split()[1]

        if(api_url != ""):
            subsystem_api_url = api_url + "/" + self.subsystem
            try:
                data = json.load(urllib2.urlopen(subsystem_api_url, timeout = 5))
            except urllib2.HTTPError, e:
                sys.stderr.write(e.code + "\n")
            except urllib2.URLError, e:
                sys.stderr.write("WARNING: Could not access control API at '"+subsystem_api_url+"'\n")
                sys.stderr.write("           due to urllib2 error '"+str(e.args)+"'\n")
                sys.stderr.write("         Will instead use default log level of '"+str(DEFAULT_LOG_LEVEL)+"'\n")
            else:
                max_matching_level = -1;
                for constraint_set in data['log_levels']:
                    level = constraint_set['level']
                    constraints = constraint_set['constraints']
                    if level <= max_matching_level:
                        continue

                    matches = 1
                    for constraint in constraints:
                        if constraint not in self.log_constraints:
                            matches = 0
                        elif self.log_constraints[constraint] != constraints[constraint]:
                            matches = 0

                    if matches == 1:
                        max_matching_level = level

                self.api_log_level = max_matching_level

    def set_log_level(self, level):
        if(level in MLOG_TEXT_TO_LEVEL):
            level = MLOG_TEXT_TO_LEVEL[level]
        elif(not isinstance(level, int) or level < LOG_LEVEL_MIN or level > LOG_LEVEL_MAX):
            sys.stderr.write("ERROR: Format for calling set_log_level is set_log_level(integer level) where level can range from " + LOG_LEVEL_MIN + " to " + LOG_LEVEL_MAX + " or be one of '" + "', '".join(MLOG_TEXT_TO_LEVEL.keys()) + "'\n")
            return 1

        self.user_log_level = level

    def set_log_msg_check_count(self, count):
        if(not isinstance(count, int)):
            sys.stderr.write("ERROR: Format for calling set_log_msg_check_count is set_log_msg_check_count(integer count)\n")
            return 1

        MSG_CHECK_COUNT = count

    def set_log_msg_check_interval(self, interval):
        if(not isinstance(interval, int)):
            sys.stderr.write("ERROR: Format for calling set_log_msg_check_interval is set_log_msg_check_interval(integer seconds)\n")
            return 1

        MSG_CHECK_INTERVAL = interval

    def use_api_log_level(self):
        self.user_log_level = -1

    def logit(self, *args):
        if len(args) != 2 or (not isinstance(args[0], int) and args[0] not in MLOG_TEXT_TO_LEVEL) or (isinstance(args[0], int) and (args[0] < LOG_LEVEL_MIN or args[0] > LOG_LEVEL_MAX)):
            sys.stderr.write("ERROR: Format for calling logit is logit(integer level, string message) where level can range from " + LOG_LEVEL_MIN + " to " + LOG_LEVEL_MAX + " or be one of '" + "', '".join(MLOG_TEXT_TO_LEVEL.keys()) + "'\n")
            return 1

        level = args[0]
        message = args[1]

        if (not isinstance(level, int)):
            level = MLOG_TEXT_TO_LEVEL[level]

        ++self.msg_count
        ++self.msgs_since_api_update

        user = getpass.getuser()
        ident = os.path.abspath(inspect.getfile(inspect.stack()[1][0]))

        if(self.msgs_since_api_update >= MSG_CHECK_COUNT or self._get_time_since_start() >= MSG_CHECK_INTERVAL):
            self.update_api_log_level()

        # If this message is an emergency, send a copy to the emergency facility first.
        if(level == 0):
            syslog.openlog("[" + self.subsystem + "] [" + MLOG_LEVELS[level] + "] [" + user + "] [" + ident + "] ", syslog.LOG_PID, EMERG_FACILITY)
            syslog.syslog(syslog.LOG_EMERG, message)
            syslog.closelog()

        if(level <= self.get_log_level()):
            syslog.openlog("[" + self.subsystem + "] [" + MLOG_LEVELS[level] + "] [" + user + "] [" + ident + "] ", syslog.LOG_PID, MSG_FACILITY)
            syslog.syslog(SYSLOG_LEVELS[level], message)
            syslog.closelog()

        return 0
