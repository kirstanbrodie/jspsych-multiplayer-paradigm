/**
 * jspsych-html-notebook
 * Kirstan Brodie
 *
 * plugin for displaying text on a notebook page and getting a button response
 *
 *
 **/


jsPsych.plugins["html-notebook"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-notebook',
    description: '',
    parameters: {
      state1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'State 1',
        default: undefined,
        description: 'The integer to be displayed describing the level of State 1'
      },
      state2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'State 2',
        default: undefined,
        description: 'The integer to be displayed describing the level of State 2'
      },
      day: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Day',
        default: undefined,
        description: 'The integer to be displayed indicating the day'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },

    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<div class="notebook-paper"><div class="notebook-lines"><div class="notebook-text">DAY '+trial.day+'<br><br/>Tired: '+trial.state1+'<br><br/>Content: '+trial.state2+'</div></div><div class="notebook-holes notebook-hole-top"></div><div class="notebook-holes notebook-hole-middle"></div><div class="notebook-holes notebook-hole-bottom"></div></div>';

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "state1": trial.state1,
        "state2": trial.state2,
        "key_press": String.fromCharCode(response.key)
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
