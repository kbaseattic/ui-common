#!/usr/bin/perl

use strict;
use warnings;

local $/ = undef;

my @files = @ARGV;

if ($ARGV[0] eq '-z') {
  open my $fh, '<', $ARGV[1];
  my $files = <$fh>;
  close $fh;

  @files = split /\n/, $files;
}

foreach my $file (@files) {
  open my $fh, '<', $file or next;
  my $widget = <$fh>;
  close $fh;

  next unless length $widget;

  $widget =~ s/define\((?:'[^']+'\s*,\s*)?\[(.+?)\]\s*,\s*function\s*\((.*?)\)/rewrite($1, $2)/es;

  $widget =~ s/\$.KBWidget/return KBWidget/g;

  #change constructor invocation
  $widget =~ s/^((?:[^\n=]+=)?)([^\S\n]*)(.+)\.(kbase\w+)\s*\(\s*{/$1$2 new $4($3, {/gm;

  #change empty invocation. Yes, yes, it's lazy.
  $widget =~ s/^((?:[^=\n]+=)?)([^\S\n]*)(.+)\.(kbase\w+)\s*\(\s*\)/$1$2 new $4($3)/gm;

  $widget =~ s/parent\s*:\s*(['"])(\w+)\1/parent : $2/g;
  $widget =~ s/parent : kbaseWidget\s*,//g;

  open my $wfh, '>', $file;
  print $wfh $widget;
  close $wfh;
}


sub rewrite {
  my $def   = shift;
  my $funcs = shift || '';

  $def =~ s/['"]//g;
  $def =~ s/^\s+|\s+$//g;
  my @def = split /\s*,\s*/, $def;

  $funcs =~ s/['"]//g;
  $funcs =~ s/^\s+|\s+$//g;
  my @funcs = grep {/^\w+$/} split /\s*,\s*/, $funcs;

  unshift(@def, 'kbwidget', 'bootstrap');

  my %seen = ();
  @def = grep { ! $seen{$_}++ } @def;

  return "define (\n\t[\n" . join(",\n", map{"\t\t'$_'"} @def) . "\n\t], function(\n"
    . join(",\n", map {stupidRewriteRule($_, \@funcs)} @def) . "\n\t)";

}

sub stupidRewriteRule {
  my $module = shift;
  my $funcs = shift;

  if ($module =~ /kbwidget/i) {
    $module = 'KBWidget';
  }
  elsif ($module =~ /bootstrap/i) {
    $module = 'bootstrap';
  }
  elsif ($module =~ /^jquery$/i) {
    $module = '$';
  }
  elsif (@$funcs) {
    $module = shift @$funcs;
  }
  $module =~ s![/-]+!_!g;
  return "\t\t" . $module;
}
