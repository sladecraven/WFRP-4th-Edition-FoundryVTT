/**
 * Add right click option to damage chat cards to allow application of damage
 * Add right click option to use fortune point on own rolls
 */
Hooks.on("getChatLogEntryContext", (html, options) => {
  let canApply = li => li.find(".opposed-card").length && game.user.isGM;
  let canApplyFortuneReroll = function(li){
    //Condition to have the fortune contextual options:
    //Be owner of the actor
    //actor have fortune point
    //Own the roll
    //Once per roll (or at least, not on a reroll card)
    //Test must be failed 
    let result = false;
    let message = game.messages.get(li.attr("data-message-id"));
    
    if(message.data.speaker.actor)
    {
      let actor = game.actors.get(message.data.speaker.actor);
      if(actor.permission == ENTITY_PERMISSIONS.OWNER && actor.data.type == "character" && actor.data.data.status.fortune.value > 0)
      {
        let testcard = li.find(".test-data");
        if(testcard.length && !message.data.flags.data.fortuneUsedReroll)
        {
          //If the test was failed
          if(message.data.flags.data.postData.roll > message.data.flags.data.postData.target)
            result = true;
        }
      }
    }
    return result;
  };
  let canApplyFortuneAddSL = function(li){
    //Condition to have the fortune contextual options:
    //Be owner of the actor
    //Have fortune point
    //Own the roll
    //Once per roll (or at least, not on a reroll card)
    let result = false;
    let message = game.messages.get(li.attr("data-message-id"));
    if(message.data.speaker.actor)
    {
      let actor = game.actors.get(message.data.speaker.actor);
      if(actor.permission == ENTITY_PERMISSIONS.OWNER && actor.data.type == "character" && actor.data.data.status.fortune.value > 0)
      {
        let testcard = li.find(".test-data");
        
        if(testcard.length && !message.data.flags.data.fortuneUsedAddSL)
            result = true;
      }
    }
    return result;
  };
  let canApplyDarkDeals = function(li){
    //Condition to have the darkdeak contextual options:
    //Be owner of character
    //Own the roll
    let result = false;
    let message = game.messages.get(li.attr("data-message-id"));
    if(message.data.speaker.actor)
    {
      let actor = game.actors.get(message.data.speaker.actor);
      if(actor.permission == ENTITY_PERMISSIONS.OWNER && actor.data.type == "character")
      {
        let testcard = li.find(".test-data");
        
        if(testcard.length)
          result = true;
      }
    }
    return result;
  };
  options.push(
    {
      name: game.i18n.localize("CHATOPT.ApplyDamage"),
      icon: '<i class="fas fa-user-minus"></i>',   
      condition: canApply,   
      callback: li => {
        let cardData = game.messages.get(li.attr("data-message-id")).data.flags.opposeData
        let defenderSpeaker = game.messages.get(li.attr("data-message-id")).data.flags.opposeData.speakerDefend;
        let updateMsg = ActorWfrp4e.applyDamage(defenderSpeaker, cardData, DAMAGE_TYPE.NORMAL)
        OpposedWFRP.updateOpposedMessage(updateMsg, li.attr("data-message-id") );
      }
    },
    {
      name: game.i18n.localize("CHATOPT.ApplyDamageNoAP"),
      icon: '<i class="fas fa-user-shield"></i>',
      condition: canApply,   
      callback: li =>  {
        let cardData = game.messages.get(li.attr("data-message-id")).data.flags.opposeData
        let defenderSpeaker = game.messages.get(li.attr("data-message-id")).data.flags.opposeData.speakerDefend;
        let updateMsg = ActorWfrp4e.applyDamage(defenderSpeaker, cardData, DAMAGE_TYPE.IGNORE_AP)
        OpposedWFRP.updateOpposedMessage(updateMsg, li.attr("data-message-id") );
      }
    },
    {
      name: game.i18n.localize("CHATOPT.ApplyDamageNoTB"),
      icon: '<i class="fas fa-fist-raised"></i>',
      condition: canApply,   
      callback: li =>  {
        let cardData = game.messages.get(li.attr("data-message-id")).data.flags.opposeData
        let defenderSpeaker = game.messages.get(li.attr("data-message-id")).data.flags.opposeData.speakerDefend;
        let updateMsg = ActorWfrp4e.applyDamage(defenderSpeaker, cardData, DAMAGE_TYPE.IGNORE_TB)
        OpposedWFRP.updateOpposedMessage(updateMsg, li.attr("data-message-id") );
      }
    },
    {
      name: game.i18n.localize("CHATOPT.ApplyDamageNoTBAP"),
      icon: '<i class="fas fa-skull-crossbones"></i>',
      condition: canApply,   
      callback: li =>  {
        let cardData = game.messages.get(li.attr("data-message-id")).data.flags.opposeData
        let defenderSpeaker = game.messages.get(li.attr("data-message-id")).data.flags.opposeData.speakerDefend;
        let updateMsg = ActorWfrp4e.applyDamage(defenderSpeaker, cardData, DAMAGE_TYPE.IGNORE_ALL)
        OpposedWFRP.updateOpposedMessage(updateMsg, li.attr("data-message-id") );
      }
    },
    {
      name: game.i18n.localize("CHATOPT.UseFortuneReroll"),
      icon: '<i class="fas fa-dice"></i>',
      condition: canApplyFortuneReroll,   
      callback: li =>  {
        let message = game.messages.get(li.attr("data-message-id"));
        game.actors.get(message.data.speaker.actor).useFortuneOnRoll(message,"reroll");
      }
    },
    {
      name: game.i18n.localize("CHATOPT.UseFortuneSL"),
      icon: '<i class="fas fa-plus-square"></i>',
      condition: canApplyFortuneAddSL,   
      callback: li =>  {
        let message = game.messages.get(li.attr("data-message-id"));
        game.actors.get(message.data.speaker.actor).useFortuneOnRoll(message,"addSL");
      }
    },
    {
      name: game.i18n.localize("CHATOPT.DarkDeal"),
      icon: '<i class="fas fa-pen-nib"></i>',
      condition: canApplyDarkDeals,   
      callback: li =>  {
        let message = game.messages.get(li.attr("data-message-id"));
        game.actors.get(message.data.speaker.actor).useDarkDeal(message);
      }
    })
  })