/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var gulp = require('gulp');

gulp.task('copy-to-build', function () {
    return gulp.src(['app/client/**/*'], {base: 'app/client'})
        .pipe(gulp.dest('build/client'));
});