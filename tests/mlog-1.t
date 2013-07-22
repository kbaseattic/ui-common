use strict;
use Bio::KBase::mlog;
use Test::More;


# test1
init_mlog("test1");
ok(get_log_level() == 3, "default log level is 3");


# test2
init_mlog("test2");
set_log_file("foo");
set_log_level(5);
ok(get_log_level() == 5, "log level is 5");


logit(3, "my test message 7 at log level 3");
logit(4, "my test message 8 at log level 4");
ok(-e "foo", "foo does exist");

unlink "foo" if -e "foo";


#logit('emergency', "this program is finished");

done_testing();

