// panel/index.js, this filename needs to match the one registered in package.json
const path = require('path')
const fs = require('fs');
const spawn = require('child_process').spawn;
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>task-runner</h2>
    <img width="100px"  src=${Editor.url('packages://task-runner/task.png')}></img>
    <hr />
    <div>说明: <span id="label">自定义命令执行面板，请在插件目录设置config.json</span></div>
    <hr />


    <ui-box-container id="container">
      


    </ui-box-container>
  `,

  // element and variable binding
  $: {
    container: '#container',
    label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    // this.$btn.addEventListener('confirm', () => {
    //   Editor.Ipc.sendToMain('task-runner:clicked');
    // });


    Editor.Ipc.sendToMain('task-runner:ready');
    const json = fs.readFileSync(Editor.url('packages://task-runner/config.json'),'utf-8');
    const configs = JSON.parse(json);
    this.$container.style.height = "calc(100% - 220px)"
    for (const iterator of configs) {
      this.spawn(iterator);
    }

  },
  spawn(config){
    var prop = document.createElement('ui-prop')
    prop.name = config.title;
    prop.labelWidth = "70"
    var button = document.createElement('ui-button');
    button.style.position ="absolute";
    button.style.right = "10px";
    prop.append(button);
    button.innerHTML = "run";
    this.$container.append(prop);
    // config.command = "sh"
    // config.cwd = path.join(Editor.Project.path,'configTable/config')
    // config.file = path.join(Editor.Project.path,'configTable/config/makeJson2.sh');
    button.addEventListener('click', () => {
      this.execScript(config);
    })
    
  },
  execScript(config){
  
    config.args = config.args.map((e)=>{
      return e.split("${projectPath}").join(Editor.Project.path);
    })
    config.cwd = config.cwd.split("${projectPath}").join(Editor.Project.path);
    process.env = Object.assign(process.env,config.env);

    
    var child = spawn(config.command,config.args,{cwd:config.cwd,env:process.env,detached: true,})
    child.stdout.on('data', function(data) {
      Editor.log(data);
    });
    //skip input
    child.stdin.write("");
    child.stderr.on('data', function(data) {
      Editor.log("error:"+data);
    });
    child.on('close', (code)=> {
      Editor.log('closing code: ' + code);
      if(config.refreshDB){
        Editor.log('refreshing assets ...');
        this.refreshDB(config.refreshDB);
      }
    });
  },
  refreshDB(path){
    Editor.assetdb.refresh('db://'+path,(err,results)=>{
      Editor.log('refresh finished');
      results.forEach( ( result )=> {
        // Editor.log(result.command+"----->"+result.path);
        if ( result.command === 'delete' ) {
          // result.uuid
          // result.url
          // result.path
          // result.type
          // Editor.log(result.command+"----->"+result.path);
        } else if ( result.command === 'change' || result.command === 'create' ) {
          // result.uuid
          // result.parentUuid
          // result.url
          // result.path
          // result.type
          // Editor.log(result.command+"----->"+result.path);
        } else if ( result.command === 'uuid-change' ) {
          // result.oldUuid
          // result.uuid
          // result.parentUuid
          // result.url
          // result.path
          // result.type
        }
      });
    });
  },
  // register your ipc messages here
  messages: {
    'task-runner:hello'(event) {
      this.$label.innerText = 'Hello!';
    },
    'asset-db:assets-created'(event){
      
    }
  }
});