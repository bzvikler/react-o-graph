# react-o-graph

Metrics of your react app in a fun graph visualization

## App Flow

1. user installs react-o-graph npm module
2. module exposes CLI which allows user to type `react-o-graph` in project directory
3. uses chokidar to watch client component repo
4. on `code change` code watcher calls below code
   1. tree builder scans files and builds JSON
   2. code injector copies files in component directory over to new react app
5. `code watcher` uses bash commands to launch two browser windows open
   1. graph UI
   2. copied over react app (contains injected calls to analysis API)
      1. on interaction with app, analysis API is called
      2. anaysis API updates graph UI
