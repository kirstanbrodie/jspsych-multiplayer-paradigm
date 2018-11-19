/*
 * Example plugin template
 */

jsPsych.plugins.wait = (function() {

  var plugin = {};

  plugin.info = {
    name: 'wait',
    description: '',
    parameters: {
      wait_message: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Wait message',
        default: "<p>Waiting for other players to be ready for the next step</p>",
        description: 'The message to be displayed during the wait trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

      // display wait message
     
    display_element.innerHTML = trial.wait_message + "<div class='spinner spinner-blk'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>"

    var start = Date.now();
   
    socket.emit('wait');

    socket.once('wait-reply', function(){
      display_element.innerHTML = '';
      // data saving
      var trial_data = {
        wait_time: Date.now() - start
      };
      // end trial
      jsPsych.finishTrial(trial_data);
    });

  };

  return plugin;
})();
