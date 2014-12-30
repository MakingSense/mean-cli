mean-CLI
================

A simple command line tool for creating front-end modules on the mean-seed project. Proud to be part of Making Sense.

Screen casts highlithing the main two use cases

<a href="http://screencast.com/t/fMgu8TjOh" >yo msmean</a>

<a href="http://screencast.com/t/k1Dmfzx1R" >yo msmean:modules</a>
 
 <a href="http://screencast.com/t/nBOxhCwejOh" >yo msmean:todo</a>
 
 <a href="http://screencast.com/t/kK9n6I85EW" >yo msmean:blog</a>
 
### Setup:
```
npm install -g generator-msmean
```

### Commands:
```yo msmean <name>```
Clones the mean-seed project to a new directory with the name you enter.

```yo msmean:modules <name>```
Creates a new module on the current application //TODO: Ensure that we are located at the project

```yo msmean:todo <name>```
Creates a new todo module on the current application, this generates a todo-list module.

```yo msmean:blog <name>```
Creates a new blog on the current application, this will generate a client-side blog module.
