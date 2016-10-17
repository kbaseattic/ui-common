#!/usr/bin/perl

# for example:
# ./drop-require.pl `find . -name '*.js'`
#
# will iterate through all files passed in, open 'em up, read 'em, rewrite 'em, and write back to the same spot
# If it thinks it failed, it will not change them

local $/ = undef;

foreach my $file (@ARGV) {
    open my $fh, '<', $file;
    my $widget = <$fh>;
    close $fh;

    if ($widget =~ /kb_define/) {

        $widget =~ s/kb_define.+?function\s*\(\s*\$?\s*\)\s*{/(function( \$, undefined ) {/s;
        $widget =~ s/}\s*\)\s*;\s*$/}( jQuery ) );/;

        open my $fh, '>', $file;
        print $fh $widget;
        close $fh;

    }
    else {
        warn "no kb_define in $file";
    }
}

