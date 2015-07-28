(module ((runtime "runtime"))
   
   (define start (lambda (node)
   )
     
   (define stop (lambda ()
   )
     
   (define render (lambda (runtime)
      "Hi, this is the blog widget"
   )
   
   ;; returns a structure with the standard api calls
   (list ("start" . start)
         ("stop" . stop)
         ("render" . render)
         ("setup" . setup))
     
   (map "start" start
        "stop" stop
        "render" render
        "setup" setup)
   
)