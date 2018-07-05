var intro = {
  name: 'intro',
  // introduction title
  "title": "Welcome to the Sugar Factory Experiment!",
  // introduction text
  "text": "Thank you for participating in our study! Make sure you are in a non-distracting environment, please read the instructions carefully!",
  // introduction's slide proceeding button text
  "buttonText": "Let the adventure begin",
  // render function renders the view
  render: function() {

    viewTemplate = $('#intro-view').html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text: this.text,
      button: this.buttonText
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  // for how many trials should this view be repeated?
  trials: 1
};

var instructions = {
  name: 'instructions',
  // instruction's title
  "title": "Instructions",
  //part 1 header//
  "text1": "Part 1",
  // instruction's text
  "text": "Imagine that you are the director of a new factory producing sugar. Your job as the director of this new sugar factory is to decide each week how many workers you want to send to your factory. Your goal is to reach a certain output level of sugar. After every week you are told whether you reached your goal, your sugar output was too low or your sugar output was too high. Good luck!",
  // instuction's slide proceeding button text
  "buttonText": "Go to practice trial",
  render: function() {

    viewTemplate = $("#instructions-view").html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text1: this.text1,
      text: this.text,
      button: this.buttonText
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};

var practice = {
  name: 'practice',
  "title": "Practice trial",
  // render function renders the view
  render: function(CT) {

    viewTemplate = $("#practice-view").html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      question: "How much workforce do you want in your factory?",
      option1: "100",
      option2: "200",
      option3: "300",
      option4: "400",
      option5: "500",
      option6: "600",
      option7: "700",
      option8: "800",
      option9: "900",
      option10: "1000",
      option11: "1100",
      option12: "1200",
      picture: _.sample(["images/sugarfactorypic.png", "images/sugarfactorypic.png"])
    }));
    startingTime = Date.now();
    // attaches an event listener to the yes / no radio inputs
    // when an input is selected a response property with a value equal to the answer is added to the trial object
    // as well as a readingTimes property with value - a list containing the reading times of each word
    $('input[name=answer]').on('change', function() {
      RT = Date.now() - startingTime; // measure RT before anything else
      var workforce = $('input[name=answer]:checked').val();
      var sugar = exp.trial_data.length == 0 ?
        600 :
        _.min([_.max([(2 * workforce - exp.trial_data[exp.trial_data.length - 1].sugar) + randomValue(), 100]), 1200]);
      console.log(sugar)
      var success = sugar >= 800 & sugar <= 1000;
      var too_low = +(sugar < 800);
      var too_high = +(sugar > 1000);
      console.log(success)
      trial_data = {
        trial_type: "practice",
        trial_number: CT + 1,
        workforce: workforce,
        sugar: sugar,
        success: success,
        too_low: too_low,
        too_high: too_high,
        RT: RT
      };
      exp.trial_data.push(trial_data)
      exp.findNextView();
    });

  },
  trials: 1
};

var practiceFeedback = {
  name: 'practiceFeedback',
  "title": "Feedback",
  "buttonText": "Next Trial",
  // render function renders the view
  render: function(CT) {

    viewTemplate = $("#practiceFeedback-view").html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      workforce: exp.trial_data[exp.trial_data.length - 1].workforce,
      sugar: (10 * exp.trial_data[exp.trial_data.length - 1].sugar),
      success: exp.trial_data[exp.trial_data.length - 1].success,
      too_high: exp.trial_data[exp.trial_data.length - 1].too_high,
      too_low: exp.trial_data[exp.trial_data.length - 1].too_low,
      button: this.buttonText
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};

var beginMainExp = {
  name: 'beginMainExp',
  "text": "Now that you have acquainted yourself with the procedure of the task, the actual experiment will begin.",
  // render function renders the view
  render: function() {

    viewTemplate = $('#begin-exp-view').html();
    $('#main').html(Mustache.render(viewTemplate, {
      text: this.text
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};

var secondround = {
  name: 'secondround',
  "title": "You finished the first round of the experiment!",
  "text": " After some discussion the sugar company decided to hire you for another season. As in the first season your job as the director of the sugar factory is to decide each week how many workers you want to send to your factory. Your goal is to reach a certain output level of sugar. After every week you are told whether you reached your goal, your sugar output was too low or your sugar output was too high. Good luck!",
  // render function renders the view
  render: function() {

    viewTemplate = $('#begin-exp-view2').html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text: this.text
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};

var main = {
  name: 'main',
  // render function renders the view
  render: function(CT) {
    // fill variables in view-template
    var viewTemplate = $('#main-view').html();
    $('#main').html(Mustache.render(viewTemplate, {
      question: "How much workforce do you want in your factory?",
      option1: "100",
      option2: "200",
      option3: "300",
      option4: "400",
      option5: "500",
      option6: "600",
      option7: "700",
      option8: "800",
      option9: "900",
      option10: "1000",
      option11: "1100",
      option12: "1200",
      picture: _.sample(["images/sugarfactorypic.png", "images/sugarfactorypic.png"])
    }));

    // update the progress bar based on how many trials there are in this round
    var filled = exp.currentTrialInViewCounter * (180 / exp.views_seq[exp.currentViewCounter].trials);
    $('#filled').css('width', filled);

    // event listener for buttons; when an input is selected, the response
    // and additional information are stored in exp.trial_info
    $('input[name=answer]').on('change', function() {
      RT = Date.now() - startingTime; // measure RT before anything else
      var workforce = $('input[name=answer]:checked').val();
      var sugar = exp.trial_data[exp.trial_data.length - 1].trial_type === "practice" ?
        600 :
        _.min([_.max([(2 * workforce - exp.trial_data[exp.trial_data.length - 1].sugar) + randomValue(), 100]), 1200]);
      console.log(sugar)
      var success = sugar >= 800 & sugar <= 1000;
      var too_low = +(sugar < 800);
      var too_high = +(sugar > 1000);
      console.log(success)

      trial_data = {
        trial_type: "main",
        trial_number: CT + 1,
        workforce: workforce,
        sugar: sugar,
        success: success,
        too_low: too_low,
        too_high: too_high,
        RT: RT
      };
      exp.trial_data.push(trial_data);
      exp.findNextView();
    });

    // record trial starting time
    startingTime = Date.now();

  },
  trials: 1
};

var randomValue = function() {
  var rand = Math.random() * 3;
  console.log(rand);
  if (rand < 1) {
    return 100;
  } else if (rand < 2) {
    return -100;
  } else {
    return 0;
  }
}

var mainFeedback = {
  name: 'mainFeedback',
  "title": "Feedback",
  "buttonText": "Next Trial",
  // render function renders the view
  render: function(CT) {

    viewTemplate = $("#practiceFeedback-view").html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      workforce: exp.trial_data[exp.trial_data.length - 1].workforce,
      sugar: 10 * exp.trial_data[exp.trial_data.length - 1].sugar,
      success: exp.trial_data[exp.trial_data.length - 1].success,
      too_high: exp.trial_data[exp.trial_data.length - 1].too_high,
      too_low: exp.trial_data[exp.trial_data.length - 1].too_low,
      button: this.buttonText
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};

var instructionspart2 = {
  name: 'instructionspart2',
  // instruction's title
  "title": "Instructions",
  //part 1 header//
  "text1": "Part 2",
  // instruction's text
  "text": "Now we will ask you some general questions about the sugar factory task, take your time and read carefully.",
  // instuction's slide proceeding button text
  "buttonText": "Go to Questionnaire",
  render: function() {

    viewTemplate = $("#instructions-view").html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text1: this.text1,
      text: this.text,
      button: this.buttonText
    }));

    // moves to the next view
    $('#next').on('click', function(e) {
      exp.findNextView();
    });

  },
  trials: 1
};



var questionaire = {
  name: 'questionaire',
  "title": "Questionnaire",
  "text": "Please answer the following questions.",
  "buttonText": "Continue",
  // render function renders the view
  render: function() {

    viewTemplate = $('#questionaire').html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text: this.text,
      buttonText: this.buttonText
    }));

    $('#next').on('click', function(e) {
      // prevents the form from submitting
      e.preventDefault();
      // records the post test info
      if (
        ($("#question1").val() != "") &&
        ($("#question2").val() != "") &&
        ($("#question3").val() != "") &&
        ($("#question4").val() != "") &&
        ($("#question5").val() != "") &&
        ($("#question6").val() != "")

      ){
      exp.global_data.question1 = $("#question1").val();
      exp.global_data.question2 = $("#question2").val();
      exp.global_data.question3 = $("#question3").val();
      exp.global_data.question4 = $("#question4").val();
      exp.global_data.question5 = $("#question5").val();
      exp.global_data.question6 = $("#question6").val();
      //exp.global_data.comments = $('#comments').val().trim();
      exp.global_data.endTime = Date.now();
      exp.global_data.timeSpent = (exp.global_data.endTime - exp.global_data.startTime) / 60000;

      // moves to the next view
      exp.findNextView();
    }
    })

  },
  trials: 1
};



var postTest = {
  name: 'postTest',
  "title": "Additional Info",
  "text": "Answering the following questions is optional, but will help us understand your answers.",
  "buttonText": "Continue",
  // render function renders the view
  render: function() {

    viewTemplate = $('#post-test-view').html();
    $('#main').html(Mustache.render(viewTemplate, {
      title: this.title,
      text: this.text,
      buttonText: this.buttonText
    }));

    $('#next').on('click', function(e) {
      // prevents the form from submitting
      e.preventDefault();

      // records the post test info
      exp.global_data.condition = exp.condition;
      exp.global_data.age = $('#age').val();
      exp.global_data.gender = $('#gender').val();
      exp.global_data.education = $('#education').val();
      exp.global_data.languages = $('#languages').val();
      exp.global_data.comments = $('#comments').val().trim();
      exp.global_data.endTime = Date.now();
      exp.global_data.timeSpent = (exp.global_data.endTime - exp.global_data.startTime) / 60000;


      //exp.trial_data.push(trial_data);
      // moves to the next view
      exp.findNextView();
    })

  },
  trials: 1
};



var thanks = {
  name: 'thanks',
  "message": "Thank you for taking part in this experiment!",
  render: function() {

    viewTemplate = $('#thanks-view').html();

    // what is seen on the screen depends on the used deploy method
    //    normally, you do not need to modify this
    if ((config_deploy.is_MTurk) || (config_deploy.deployMethod === 'directLink')) {
      // updates the fields in the hidden form with info for the MTurk's server
      $('#main').html(Mustache.render(viewTemplate, {
        thanksMessage: this.message,
      }));
    } else if (config_deploy.deployMethod === 'Prolific') {
      var prolificURL = 'https://prolific.ac/submissions/complete?cc=' + config_deploy.prolificCode;

      $('main').html(Mustache.render(viewTemplate, {
        thanksMessage: this.message,
        extraMessage: "Please press the button below<br />" + '<a href=' + prolificURL + ' class="prolific-url">Finished!</a>'
      }));
    } else if (config_deploy.deployMethod === 'debug') {
      $('main').html(Mustache.render(viewTemplate, {}));
    } else {
      console.log('no such config_deploy.deployMethod');
    }

    exp.submit();

  },
  trials: 1
};
