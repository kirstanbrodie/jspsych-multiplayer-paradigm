/**
 * jsPsych plugin for distributing virtual gifts to other players
 *
 * Kirstan Brodie
 *
 *
 */

jsPsych.plugins['gift-animation'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('gift_animation', 'gift_images', 'image');

  plugin.info = {
    name: 'gift_animation',
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
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'This array contains the keys that the subject is allowed to press in order to respond to the stimulus. '
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas size',
        array: true,
        default: [800,600],
        description: 'Array specifying the width and height of the area that the animation will display in.'
      },
      whose_turn: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Whose turn',
        array: false,
        default: undefined,
        description: 'Integer indicating the player whose turn it is - 1, 2, or 3.'
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
      	description: 'If round 2 - integer indicating who the past recipient was in round 1'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    // variable to keep track of timing info and responses
    var start_time = 0;
    var responses = {};

    var player = trial.whose_turn;

    var choice = "";
    var gift1 = "";
    var gift2 = "";
    
    if (trial.round == 1) {
    	var new_choices = trial.choices;
    } else {
    	var new_choices = trial.choices.filter(used => used != trial.past_gift); // removes the option to give gift to the same person twice
    }


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

    if (player === 1) { // if current player is player 1....
      if (trial.round == 1) { // and if the first gift, out of 2, is being given...
      	gift1 = s.image(trial.gift_images[0], 200, 180, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 270, 180, 40, 40); 
      } else if (trial.round == 2 && trial.past_gift == 50) { //else if the second gift is being given and the past one was given to player 2...
      	gift1 = s.image(trial.gift_images[0], 575, 180, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 270, 180, 40, 40);
      } else { //else if the second gift is being given and the past gift was given to player 3....
      	gift1 = s.image(trial.gift_images[0], 405, 455, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 270, 180, 40, 40);
      }
    } else if (player === 2) {
      if (trial.round == 1) {
      	gift1 = s.image(trial.gift_images[0], 540, 180, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 610, 180, 40, 40); 
      } else if (trial.round == 2 && trial.past_gift == 49) {
      	gift1 = s.image(trial.gift_images[0], 235, 180, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 610, 180, 40, 40); 
      } else {
      	gift1 = s.image(trial.gift_images[0], 405, 455, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 610, 180, 40, 40);
      }
    } else {
      if (trial.round == 1) {
      	gift1 = s.image(trial.gift_images[0], 370, 455, 40, 40);
      	gift2 = s.image(trial.gift_images[1], 440, 455, 40, 40); 
      } else if (trial.round == 2 && trial.past_gift == 49){
      	gift1 = s.image(trial.gift_images[0], 235, 180, 40, 40); 
      	gift2 = s.image(trial.gift_images[1], 440, 455, 40, 40); 
      } else {
      	gift1 = s.image(trial.gift_images[0], 575, 180, 40, 40); 
      	gift2 = s.image(trial.gift_images[1], 440, 455, 40, 40);
      }
    };

    // function to animate the gift movement using snap.svg

    var moveGift = function(info) {
      choice = info.key

      if (trial.round == 1) { 
        var gift = gift1;
      } else {
        var gift = gift2;
      }

      if (choice == 49) {
        gift.animate({x: 235, y: 180}, 1000, mina.linear, function() {
          setTimeout(endTrial, 250);
        });
      } else if (choice == 50) {
        gift.animate({x: 575, y: 180}, 1000, mina.linear, function() {
          setTimeout(endTrial, 250);
        });
      } else if (choice == 51) {
        gift.animate({x: 405, y: 455}, 1000, mina.linear, function() {
          setTimeout(endTrial, 250);
        });
      } else {
        alert('Please choose one of the two other players.');
      }
    }

    // add key listener
    // after response function calls the animation function when a key has been pressed and records the key response info

    var after_response = function(info) {
      moveGift(info);
      responses = {
      	"key": info.key,
        "gift": trial.gift_images[trial.round-1],
        "rt": info.rt
      };
    }

    key_listener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: new_choices,
      rt_method: 'date',
      persist: false,
      allow_held_key: false
    });

    timer(); // start the timer at the beginning of the trial

    function endTrial() {

      display_element.innerHTML = ''; // clear the screen 

      jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

      var trial_data = {
        //"gift_images": JSON.stringify(trial.gift_images), //can probably remove this until we add in other possible gifts
        "player": player
      };

      trial_data = {...trial_data, ...responses} // combines trial data object with responses object

      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();