# New Application Design

## Javascript 

Creating Objects

Factory Pattern

At the heart of Javascript are objects, and there are many ways to create and operate on them. In isolated code, it matters little what approach one takes. However, in code that is open on the web, open sourced, and operated on by teams, there are constraints that need to be taken into account.

### The Constraints

#### Simple

The less code the better, the closer a call is to the definition, the better.

Short methods are easier to understand and debug.

Simpler code is easier for javascript beginners to understand and emulate.

#### Narrow API

Many object methods are used solely for internal support. Javascript does not provide a mechanism for private or protected methods -- all methods are "public". This is not a problem, it is the definition of the language. A method is just a property, and properties are by definition visible on the object.

But this is a problem if one wants to keep the API, the public interface to the object, narrow, restricted. 

One approach is to prefix "private" methods with an underscore. It makes them harder to remember, and signals that they are not to be accessed directly. The problem with this is that they often ARE used. This can be because the official api does not expose useful functionality, or because they are relied upon for overriding behavior via inheritance.

In any case, they often do end up as dependencies. And worse, they result in poorer "official" apis. Internal users often rely on using these, since they consider themselves to be "priviledged" users. And as users discover them and their usage becomes widespread, it reduces pressure on the api developers to improve the api to make their usage unnecessary.

#### Secure

There are known security vectors for javascript in the wild.

One of these is the "this". Javascript methods are just functions stored as properties on an object. In typical usage, when accessed via the object using dot or array notation, the special "this" variable is set to the object they were invoked from. This is what gives methods their object-oriented feel! However, it is also possible to use the method in isolation, since it is "just" a function, and to use function methods on it to replace the "this" (which is known as the function context). So one make invoke a method from an object using any other object as the context. This is a problem because, if one knows the internal mechanics of the method (easy to find through browser inspection, or open source code), one can inject code in two ways.

One can run a run a method on one's own object.

One can run one's method on the object.

All of this relies on the method actually using the "this" variable. If your methods do not use a "this" object, they will not be sensitive to this-swapping.

How can this be exploited?

Imagine your "this" has an auth token, and your method uses the auth token to access an api on behalf of a user. The method could be invoked with a different this, and a different token. Or a different api call could be conducted using the this object with the user token. E.g. an api call could be "save profile", and a hacker could instead replace the method with a call to "delete profile".

#### Maintainable


#### Testable



### Prototypal with ES5

Javascript is known as a "prototypal object oriented" language. This is due to the fact that it is! Every object has a reference to another object, from which it "inherits" all of its properties.

ES5 introduced new APIs for dealing more directly with object prototyping. Object.create() is at the heart of this. It makes creation of object families more explicit, easier to control, and uses a standard format.

It is my preferred way of creating classic Javascript objects. However, due to the constraints mentioned above, it may not be ideal for our development environment.

### Protyping the hard way

I won't even go into this. There are approaches to prototypal construction that use direct manipulation of object prototypes. I find this approach overly complex and confusing, and too dependent upon the prototyping mechanism. It typically involves manipulation of the prototype property of an object. 

I prefer the mental model of an object being isolated from its prototype. Creating an object should never involve manipulation of its prototype. This also violates the principle of object families and inheritance. An object should not make assumptions about how its prototype parent is being used.

### Constructor

The constructor technique is very popular, especially with the "crossover" crowd. It uses the "new" operator to create new objects using the constructor object. In principle it is very similar to the factor technique, but it uses the hidden constructor method to create the object, rather than an explicit factory method or function.


### Factory

## App Components

- index page
- main.js
- Runtime
- App
- Panels
    - displayable
    - redidirects
- Widgets
    - standalone widgets
    - complex widgets with subwidgets
    - utility widgets (e.g. charting)
    - app-level widgets (e.g. dialogs)
- Top Level 
    - navbar
        - menu
        - title
        - buttons
            - dropdown buttons
        - notifications
            - notifications list dopdown
        - login menu
    - content area
    - modal dialog
    - pop-up
- Major Modules
    - App
    - Runtime
    - Session
    - Config
    - HTML
    
## What is a Widget?

An widget is an implementation of the widget interface.