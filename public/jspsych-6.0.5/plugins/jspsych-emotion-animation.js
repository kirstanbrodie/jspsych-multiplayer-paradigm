/**
 * jsPsych plugin for displaying a player's emotional reaction
 *
 * Kirstan Brodie
 *
 *
 */

jsPsych.plugins['emotion-animation'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('emotion_animation', 'emotion_images', 'image');

  plugin.info = {
    name: 'emotion_animation',
    description: '',
    parameters: {
      gift_images: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Gift images',
        default: undefined,
        array: true,
        description: 'A gift image is a path to an image file.'
      },
      player_images: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Player images',
        default: undefined,
        array: true,
        description: 'A player image is a path to an image file.'
      },
      emotion_images: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Emotion images',
        default: undefined,
        array: true,
        description: 'An emotion image is a path to an image file.'
      },
      whose_turn: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Whose turn',
        array: false,
        default: undefined,
        description: 'Integer indicating the player whose turn it is - 1, 2, or 3.'
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas size',
        array: true,
        default: [800,600],
        description: 'Array specifying the width and height of the area that the animation will display in.'
      },
      round: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Round',
        array: false,
        default: undefined,
        description: 'Integer indicating which round of gift-giving the player is on - 1 or 2.'
      },
      past_gift: {
      	type: jsPsych.plugins.parameterType.INT,
      	pretty_name: "Past gift recipient",
      	array: false,
      	default: 0,
      	description: "Integer indicating who the past recipient was in round 2."
      },
      past_past_gift: { 
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Past past gift recipient",
        array: false,
        default: 0,
        description: "Integer indicating who the past recipient was in round 1."
      },
      happy_level: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Level of happiness",
        array: false,
        default: 3,
        description: "Integer indicating the level of happiness of the gift recipient."
      },
      surprise_level: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Level of surprise",
        array: false,
        default: 0,
        description: "Integer indicating the level of surprise of the gift recipient."
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    // variable to keep track of timing info and responses
    var start_time = 0;

    var giver = trial.whose_turn;

    if (trial.round == 1) {
      var receiver = trial.past_past_gift;
    } else {
      var receiver = trial.past_gift;
    }

    var choice = "";
    var gift1 = "";
    var gift2 = "";

    function timer() {
	    // start timer for this trial
	    start_time = (new Date()).getTime();
    }

    display_element.innerHTML = "<svg id='jspsych-gift-animation' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>";

    // displaying the game environment using snap.svg

    var s = Snap("#jspsych-gift-animation");

    var box1 = s.rect(130, 50, 250, 200, 10).attr({ fill: "#787586", stroke: "black", strokeWidth: 3 });
    var box2 = s.rect(470, 50, 250, 200, 10).attr({ fill: "#787586", stroke: "black", strokeWidth: 3 });
    var box3 = s.rect(300, 325, 250, 200, 10).attr({ fill: "#787586", stroke: "black", strokeWidth: 3 });
    var giftBox1 = s.rect(180, 170, 150, 60).attr({ fill: "#ACA7CB", stroke: "black", strokeWidth: 2 });
    var giftBox2 = s.rect(520, 170, 150, 60).attr({ fill: "#ACA7CB", stroke: "black", strokeWidth: 2 });
    var giftBox3 = s.rect(350, 445, 150, 60).attr({ fill: "#ACA7CB", stroke: "black", strokeWidth: 2 });
    var player1 = s.image(trial.player_images[0], 205, 60, 100, 100);
    var player2 = s.image(trial.player_images[1], 545, 60, 100, 100);
    var player3 = s.image(trial.player_images[2], 375, 335, 100, 100);

    // determining where to display each gift at any given point, in any given round/turn

    
    if (trial.past_past_gift == 49) {
      gift1 = s.image(trial.gift_images[0], 235, 180, 40, 40);
    } else if (trial.past_past_gift == 50) {
      gift1 = s.image(trial.gift_images[0], 575, 180, 40, 40);
    } else if (trial.past_past_gift == 51) {
      gift1 = s.image(trial.gift_images[0], 405, 455, 40, 40);
    }

    if (trial.round == 2){
      if (trial.past_gift == 49) {
        gift2 = s.image(trial.gift_images[1], 235, 180, 40, 40);
      } else if (trial.past_gift == 50) {
        gift2 = s.image(trial.gift_images[1], 575, 180, 40, 40);
      } else {
        gift2 = s.image(trial.gift_images[1], 405, 455, 40, 40);
      }
    } else if (trial.round == 1) {
      if (giver === 1) {
        gift2 = s.image(trial.gift_images[1], 270, 180, 40, 40);
      } else if (giver === 2) {
        gift2 = s.image(trial.gift_images[1], 610, 180, 40, 40);
      } else {
        gift2 = s.image(trial.gift_images[1], 440, 455, 40, 40);
      }
    }

    // function to display the emotional reaction using snap.svg

    var react = function() {

      if (receiver == 49) {
        if (trial.surprise_level == 2) {
          player1 = s.image(trial.emotion_images[5], 205, 60, 100, 100);
        } else {
          player1 = s.image(trial.emotion_images[trial.happy_level], 205, 60, 100, 100);
        }
      } else if (receiver == 50) {
        if (trial.surprise_level == 2) {
          player2 = s.image(trial.emotion_images[5], 545, 60, 100, 100);
        } else {
          player2 = s.image(trial.emotion_images[trial.happy_level], 545, 60, 100, 100);
        }
      } else {
        if (trial.surprise_level == 2) {
          player3 = s.image(trial.emotion_images[5], 375, 335, 100, 100);
        } else {
          player3 = s.image(trial.emotion_images[trial.happy_level], 375, 335, 100, 100);
        }
      }

      setTimeout(endTrial, 1000);
    }

    timer(); // start the timer at the beginning of the trial
    react();

    function endTrial() {

      display_element.innerHTML = ''; // clear the screen 

      jsPsych.finishTrial();
    }
  };

  return plugin;
})();