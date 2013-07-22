package Bio::KBase::mlog;

@ISA = qw(Exporter);
@EXPORT = qw(init_mlog get_log_level update_config set_log_level set_log_file set_log_msg_check_count set_log_msg_check_interval clear_user_log_level logit);

use strict;
use warnings;
use Config::Simple;
use LWP::Simple;
use JSON qw( decode_json );
use DateTime;
use Cwd 'abs_path';
use Data::Dumper;
use Sys::Hostname;

use Sys::Syslog qw( :DEFAULT setlogsock);

require Exporter;

# $ENV{'MLOG_CONFIG_FILE'} should point to an INI-formatted file, or an empty string, or should not exist.
my $MLOG_CONFIG_FILE = "";
my $DEFAULT_LOG_LEVEL = 3;
my $MSG_CHECK_COUNT = 100;
my $MSG_CHECK_INTERVAL = 300; # 300s = 5min
my $MSG_FACILITY = 'local1';
my $EMERG_FACILITY = 'local0';
my @SYSLOG_LEVEL_TEXT  = ( 'emerg', 'alert', 'crit', 'err',
                           'warning', 'notice', 'info', 'debug' );
my %MLOG_TEXT_TO_LEVEL = ( 'EMERGENCY' => 0,
                           'ERROR' => 1,
                           'WARNING' => 2,
                           'INFO' => 3,
                           'DEBUG' => 4,
                           'DEBUG2' => 5,
                           'DEBUG3' => 6 );
my @MLOG_LEVELS = ( 'EMERGENCY', 'ERROR', 'WARNING', 'INFO', 'DEBUG', 'DEBUG2', 'DEBUG3' );

my $SUBSYSTEM = "";
my $API_LOG_LEVEL = -1;
my $USER_LOG_LEVEL = -1;
my $USER_LOG_FILE = "";
my $CONFIG_LOG_LEVEL = -1;
my $CONFIG_LOG_FILE = "";
my $LOG_CONSTRAINTS;
my $MSG_COUNT = 0;
my $TIME_AT_LAST_CONFIG_UPDATE = "";
my $MSGS_SINCE_LAST_CONFIG_UPDATE = 0;

=pod

=head1 NAME

mlog (message log)

=head1 DESCRIPTION

A library for sending message logging to syslog.

The library checks for the config variables: mlog_log_level, mlog_api_url, and mlog_log_file in an INI-formatted config file that can be specified by setting the environment variable MLOG_CONFIG_FILE. The library first looks for these variables under a 'section' in the INI file which matches the 'subsystem' name in your init_mlog() call. mlog_log_level can be used to set a global log level for mlog. mlog_api_url can be set to provide a control API for setting log levels. mlog_log_file can be set to provide the location of a file to which we can log messages in addition to syslog.

The priority that is used to decide which log level setting is used for logging is as follows:

=over 10

=item * USER_LOG_LEVEL: log level set within the program that is using mlog by calling set_log_level()

=item * CONFIG_LOG_LEVEL: log level (mlog_log_level) set within the INI file located at the path set in $ENV{'MLOG_CONFIG_FILE'}

=item * API_LOG_LEVEL: log level set by the logging control server in the control API matching the log constraints (if mlog_api_url is specified in config file)

=item * DEFAULT_LOG_LEVEL: INFO, log level = 3

=back

=head1 METHODS

init_mlog(string subsystem, hashref constraints): Initializes mlog. You should call this at the beginning of your program. Constraints are optional.

logit(int level, string message): sends log message to syslog.

=over 10

=item * level: (0-6) The logging level for this message is compared to the logging level that has been set in mlog.  If it is <= the set logging level, the message will be sent to syslog (and if specified in the mlog configuration, a log file), otherwise it will be ignored.  Logging level is set to 3 if message control API cannot be reached and the user does not set the log level. Log level can also be entered as string (e.g. 'DEBUG')

=item * message: This is the log message.

=back

get_log_level(): Returns the current log level as an integer.

set_log_level(integer level) : Sets the log level. Only use this if you wish to override the log levels that are defined by the mlog configuration file and the control API. Can also be entered as string (e.g. 'DEBUG')

=over 10

=item * level : priority

=item * 0 : EMERGENCY - vital component is down

=item * 1 : ERROR - error that prevents proper operation

=item * 2 : WARNING - problem that does not prevent operation

=item * 3 : INFO - high level information on operations

=item * 4 : DEBUG - lowest level of debug

=item * 5 : DEBUG2 - second level of debug

=item * 6 : DEBUG3 - highest level of debug

=back

set_log_file(string filename): Used to set or update the path to the file where we would like to have messages logged. Log file set in program with this function will over-ride any log file set in the config file.

set_log_msg_check_count(integer count): Used to set the number the messages that mlog will log before checking the mlog configuration and querying the control API for the log level if mlog_api_url is set in $ENV{'MLOG_CONFIG_FILE'} (default is 100 messages).

set_log_msg_check_interval(integer seconds): Used to set the interval, in seconds, that will be allowed to pass before mlog will check the mlog configuration and query the control API for the log level if mlog_api_url is set in $ENV{'MLOG_CONFIG_FILE'} (default is 300 seconds).

update_config() : Checks the mlog configuration file at $ENV{'MLOG_CONFIG_FILE'} for mlog_log_level, mlog_api_url, and mlog_log_file and checks the control API for the currently set log level if mlog_api_url is set.

clear_user_log_level() : Removes the user-defined log level.

=cut

sub init_mlog {
    my ($sub, $lc) = @_;
    unless(defined $sub) {
        print STDERR "ERROR: You must define a subsystem when calling init_log()\n";
        return 1;
    }
    $SUBSYSTEM = $sub;
    if(defined $lc) {
        $LOG_CONSTRAINTS = $lc;
    }
    $USER_LOG_LEVEL = -1;
    $CONFIG_LOG_LEVEL = -1;
    $CONFIG_LOG_FILE = "";
    $MSG_COUNT = 0;

    if(exists $ENV{'MLOG_CONFIG_FILE'}) {
        $MLOG_CONFIG_FILE = $ENV{'MLOG_CONFIG_FILE'};
    }

    update_config();
}

sub _get_time_since_start {
    my $now = DateTime->now( time_zone => 'local' )->set_time_zone('floating');
    my $seconds_duration = $now->subtract_datetime_absolute($TIME_AT_LAST_CONFIG_UPDATE);
    return $seconds_duration->seconds;
}

sub get_log_level {
    if($USER_LOG_LEVEL != -1) {
        return $USER_LOG_LEVEL;
    } elsif($CONFIG_LOG_LEVEL != -1) {
        return $CONFIG_LOG_LEVEL;
    } elsif($API_LOG_LEVEL != -1) {
        return $API_LOG_LEVEL;
    } else {
        return $DEFAULT_LOG_LEVEL;
    }
}

sub update_config {
    $API_LOG_LEVEL = -1;
    $MSGS_SINCE_LAST_CONFIG_UPDATE = 0;
    $TIME_AT_LAST_CONFIG_UPDATE = DateTime->now( time_zone => 'local' )->set_time_zone('floating');

    # Retrieving config variables.
    my $api_url = "";
    if(-e $MLOG_CONFIG_FILE && -s $MLOG_CONFIG_FILE > 0) {
        my $cfg = new Config::Simple($MLOG_CONFIG_FILE);
        my $subsys_hash = $cfg->get_block($SUBSYSTEM);
        my $global_hash = $cfg->get_block('global');
        
        if(exists $subsys_hash->{'mlog_log_level'}) {
            $CONFIG_LOG_LEVEL = $subsys_hash->{'mlog_log_level'};
        } elsif(exists $global_hash->{'mlog_log_level'}) {
            $CONFIG_LOG_LEVEL = $global_hash->{'mlog_log_level'};
        }
                
        if(exists $subsys_hash->{'mlog_api_url'}) {
            $api_url = $subsys_hash->{'mlog_api_url'};
        } elsif(exists $global_hash->{'mlog_api_url'}) {
            $api_url = $global_hash->{'mlog_api_url'};
        }

        if(exists $subsys_hash->{'mlog_log_file'}) {
            $CONFIG_LOG_FILE = $subsys_hash->{'mlog_log_file'};
        } elsif(exists $global_hash->{'mlog_log_file'}) {
            $CONFIG_LOG_FILE = $global_hash->{'mlog_log_file'};
        }
    }

    unless($api_url eq "") {
        my $subsystem_api_url = $api_url."/$SUBSYSTEM";
        my $json = get($subsystem_api_url);
        if(defined $json) {
            my $decoded_json = decode_json($json);
            my $max_matching_level = -1;
            foreach my $constraint_set (@{$decoded_json->{'log_levels'}}) {
                my $level = $constraint_set->{'level'};
                my $constraints = $constraint_set->{'constraints'};
                if($level <= $max_matching_level) {
                    next;
                }
                my $matches = 1;
                foreach my $constraint (keys %{$constraints}) {
                    if(! exists $LOG_CONSTRAINTS->{$constraint}) {
                        $matches = 0;
                    } elsif($LOG_CONSTRAINTS->{$constraint} ne $constraints->{$constraint}) {
                        $matches = 0;
                    }
                }
                if($matches == 1) {
                    $max_matching_level = $level;
                }
            }
            $API_LOG_LEVEL = $max_matching_level;
        } else {
            print STDERR "Could not retrieve mlog subsystem from control API at: $subsystem_api_url\n";
        }
    }
}

sub set_log_level {
    my ($level) = @_;
    if(exists $MLOG_TEXT_TO_LEVEL{$level}) {
        $level = $MLOG_TEXT_TO_LEVEL{$level};
    } elsif($level !~ /^\d+$/ || $level < 0 || $level > (@MLOG_LEVELS - 1)) {
        print STDERR "ERROR: Format for calling set_log_level is set_log_level(integer level) where level can range from 0 to ".(@MLOG_LEVELS - 1)." or be one of '".join("', '",keys %MLOG_TEXT_TO_LEVEL)."'\n";
        return 1;
    }
    $USER_LOG_LEVEL = $level;
}

sub set_log_file {
    my ($filename) = @_;
    $USER_LOG_FILE = $filename;
}

sub set_log_msg_check_count {
    my ($count) = @_;
    if($count !~ /^\d+$/) {
        print STDERR "ERROR: Format for calling set_log_msg_check_count is set_log_msg_check_count(integer count)\n";
        return 1;
    }
    $MSG_CHECK_COUNT = $count;
}

sub set_log_msg_check_interval {
    my ($interval) = @_;
    if($interval !~ /^\d+$/) {
        print STDERR "ERROR: Format for calling set_log_msg_check_interval is set_log_msg_check_interval(integer seconds)\n";
        return 1;
    }
    $MSG_CHECK_INTERVAL = $interval;
}

sub clear_user_log_level {
    $USER_LOG_LEVEL = -1;
}

sub logit {
    my ($level, $message) = @_;
    if(@_ != 2 ||
       ($level !~ /^\d+$/ && (! exists $MLOG_TEXT_TO_LEVEL{$level})) ||
       ($level =~ /^\d+$/ && ($level < 0 || $level > (@MLOG_LEVELS - 1)))) {
        print STDERR "ERROR: Format for calling logit is logit(integer level, string message) where level can range from 0 to ".(@MLOG_LEVELS - 1)." or be one of '".join("', '",keys %MLOG_TEXT_TO_LEVEL)."'\n";
        return 1;
    }

    if($level !~ /^\d+$/) {
        $level = $MLOG_TEXT_TO_LEVEL{$level};
    }

    if($MSG_COUNT == 0 && $TIME_AT_LAST_CONFIG_UPDATE eq "") {
        print STDERR "WARNING: init_mlog() was not called, so I will call it for you.\n";
        init_mlog();
    }

    ++$MSG_COUNT;
    ++$MSGS_SINCE_LAST_CONFIG_UPDATE;

    my $user = $ENV{'USER'};
    my $ident = abs_path($0);
    my $logopt = "";

    if($MSGS_SINCE_LAST_CONFIG_UPDATE >= $MSG_CHECK_COUNT || _get_time_since_start() >= $MSG_CHECK_INTERVAL) {
        update_config();
    }

    # If this message is an emergency, send a copy to the emergency facility first.
    if($level == 0) {
        setlogsock('unix');
        openlog("[$SUBSYSTEM] [$MLOG_LEVELS[$level]] [$user] [$ident] [$$]", $logopt, $EMERG_FACILITY);
        syslog($SYSLOG_LEVEL_TEXT[$level], "$message");
        closelog();
    }

    if($level <= get_log_level($SUBSYSTEM)) {
        setlogsock('unix');
        openlog("[$SUBSYSTEM] [$MLOG_LEVELS[$level]] [$user] [$ident] [$$]", $logopt, $MSG_FACILITY);
        syslog($SYSLOG_LEVEL_TEXT[$level], "$message");
        closelog();
        my $log_file = "";
        if($USER_LOG_FILE ne "") {
            $log_file = $USER_LOG_FILE;
        } elsif($CONFIG_LOG_FILE ne "") {
            $log_file = $CONFIG_LOG_FILE;
        }

        if($log_file ne "") {
            open LOG, ">>$log_file" || print STDERR "Could not print log message to $log_file\n";
            print LOG localtime(time)." ".hostname." [$SUBSYSTEM] [$MLOG_LEVELS[$level]] [$user] [$ident] [$$]: $message\n";
            close LOG;
        }
    } else {
        return 1;
    }
}

1;
