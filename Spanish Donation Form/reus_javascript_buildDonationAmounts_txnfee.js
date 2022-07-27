var useAlternateAmounts = [[?x[[S334:alt]]x::x1x::true::false]];
var donate;
window.buildDonationAmounts = function() {
  var dynamicAmounts = [];

  var sanitize =function (input) {
    if(typeof input =="undefined" || input === null)  {
      return null;
    }
    var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                 replace(/<[\/\!]*?[^<>]*?>/gi, '').
                 replace(/<style[^>]*?>.*?<\/style>/gi, '').
                 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '').
                 replace(/\n/, '<br />');
    return output;
  };
  var getAnyURLParameter = function(url,name){
    return sanitize(decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null);
  };
  var addURLParameter = function(url,name,value){
    var val;
    if(typeof url !== 'string'){
      return false;
    } else if (val = getAnyURLParameter(url,name)){
      //new value is different than what came before
      if( val !== value ){
        var param = new RegExp(name+'='+'([^&;])');
        return url.replace(param, name+'='+value);
      } else {
      //new value is the same as what came before
        return;
      }
    } else if (url.indexOf("?") >= 0){
      return url + "&" + name + "=" + value;
    } else {
      return url + "?" + name + "=" + value;
    }
  };

  if(useAlternateAmounts && typeof alternateAmounts != "undefined" && alternateAmounts.length) {
    dynamicAmounts = alternateAmounts;
    $('#ProcessForm').attr('action', addURLParameter($('#ProcessForm').attr('action'),'alt', '1'));
  } else {
    $('.donation-level-amount-container').each(function() {
      dynamicAmounts.push(parseFloat($(this).text().replace(/[^0-9\.]/g,'')));
    });
  }


  if(typeof defaultedLevelIndex == "undefined" || isNaN(parseInt(defaultedLevelIndex,10)) || parseInt(defaultedLevelIndex, 10) >= dynamicAmounts.length ) {
    defaultedLevelIndex = 1;
  }
  donate = dynamicAmounts;
  defaultedLevel = donate[defaultedLevelIndex];

  if($('.donation-level-input-container input[type="radio"]:checked').length && !useAlternateAmounts) {
    defaultedLevel = parseFloat($('label[for="'+$('.donation-level-input-container input[type="radio"]:checked').attr('id')+'"]').text().replace(/[^0-9\.]/g,''));
  }

  if($('.custom-donation-levels').length === 0) {
    $(".form-donation-level,.levels-label").first().parent().before("<div class='form-row'><div class='custom-donation-levels'></div></div>");
  }

  //logic for pulling the dynamic donation levels
  for(var i = 0; i < donate.length; i++){
    $(".custom-donation-levels").append("<div class='donate-level-container container-level-" + i + "'><input id='donate-level-" + i + "' type='radio' name='cust-level' data-val='" + donate[i] + "' data-index='" + i + "' /><label for='donate-level-" + i + "'>$<span id='text-level-"+ i +"'>" + donate[i] + "</span></label></div>");
  }
  //add custom input
  if(typeof hideOtherAmount === "undefined" || hideOtherAmount !== true) {
    $(".custom-donation-levels").append("<div class='donate-level-container donate-level-container--other'><input id='donate-level-custom' type='radio' name='cust-level' data-val='' /><label for='donate-level-custom'><input id='cust-level-input' name='cust-level-input' placeholder='"+(donate.length ? [[?xx[[S72:locale]]xx::xxes_USxx::'otro'::'other']] : '')+"'/><span id='cust-level-text'></span></label>");
  }

  $("#level_flexiblegift_type_Row").css("position", "absolute").css("left", "-9999px");
  $("#level_flexibleduration_row").css("position", "absolute").css("left", "-9999px");
  $(".don-standard-levels.form-row").css("position", "absolute").css("left", "-9999px");

  //donate radio button clicks
  $(".donate-level-container input").click(function(){
    $(".donate-level-container").removeClass("selected");
    $(this).parent().addClass("selected");
    var val = $(this).attr("data-val");
    $(".donation-level-user-entered input").val(val).trigger('change');;
    if(typeof updateButton == "function") { updateButton(val);}
  });

  //custom input behavior
  $("#cust-level-input").click(function(){
    $("#donate-level-custom").trigger("click");
    var val = $(this).val();
    //console.log(val);
    $("#donate-level-custom").attr("data-val", val);
    $(".donation-level-user-entered input").val(val).trigger('change');
    if(typeof updateButton == "function") { updateButton();}
  });

  $("#cust-level-input").keyup(function(){
    var val = $(this).val();
    //console.log(val);
    $("#donate-level-custom").attr("data-val", val);
    $(".donation-level-user-entered input").val(val).trigger('change');
    if(typeof updateButton == "function") { updateButton();}
  });

  //default checked radio
  console.log("input[data-val='"+ defaultedLevel + "']");
  var standardLevel = true;
  var donationLevel = $(".donation-level-user-entered input").val();
  if (donationLevel && donationLevel != "") {
      donationLevel = (parseFloat(donationLevel.replace("$", "").replace(/,/g, ""))).toFixed(2);
      if (-1 == $.inArray(donationLevel, donate)) { // Custom amount
          standardLevel = false;
          $("#cust-level-input").val(donationLevel.toString());
          $("#donate-level-custom").attr("data-val", donationLevel).click();
      }
  } else {
    [[?xstaticx::x[[S80:bfday_gc]]x::
    donationLevel = $('#donate-level-5').attr("data-val");
    ::
    donationLevel = defaultedLevel;
    ]]
    console.log('donation level is: ' + donationLevel)
  }

  [[?xstaticx::x[[S80:bfday_gc]]x::
  if (standardLevel) {
      $("input[data-val='" + donationLevel + "']").attr("checked", "true");
  }
  ::
  if (standardLevel) {
    $("input[data-val='" + donationLevel + "']").first().attr("checked", "true");
  }
  ]]

  $(".donation-level-user-entered").siblings('.donation-level-label-input-container').find("input").trigger("click");
  $(".donation-level-user-entered input").val(donationLevel).trigger('change');

};
