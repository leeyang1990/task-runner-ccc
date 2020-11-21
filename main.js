'use strict';
const path = require('path')
const fs = require('fs');
module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('task-runner');
    },
    'say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('task-runner', 'task-runner:hello');
    },
    'clicked' () {
      // Editor.log('Button clicked!');
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('task-runner', 'task-runner:hello');
    },
    'ready'(){
      //config

      Editor.log("task-runner ready")
    }
  },
};