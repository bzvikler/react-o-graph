# react-o-graph

Metrics of your react app in a fun graph visualization

## Using React-o-graph in your app

1. in the root directory run `npm install`
2. from the root directory run `npm link`, this allows other projects to import react-o-graph
3. from the root directory of your react app, run `react-o-graph`
   1. *note* the first run will take a while

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
