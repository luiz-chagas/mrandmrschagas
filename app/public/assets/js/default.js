$(window).on('load', function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});
$(document).ready(function() {
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 40
  })
  $('a.scrollto').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 40)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });
});

// RSVP Form - jquery validation
// $("#rsvpForm").validate({
//   rules: {
//     guestName: {
//       required: true
//     },
//     guestEmail: {
//       required: true
//     },
//     guestMessage: {
//       required: true
//     }
//   }
// });

function startRSVP() {
  swal({
    title: `What's your name?`,
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Next',
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    inputValidator: (value) => {
      return !value && 'You need to write something!'
    }
  }).then((result) => {
    if (!result || !result.value) {
      return;
    }

    const user = findRSVP(result.value);

    if (user.tickets > 0) {
      swal({
        type: 'success',
        title: 'Yay!',
        html: `I've found your reservation ${user.name}! <br> You have up to ${user.tickets} tickets.`,
        confirmButtonText: 'Next',
        showCancelButton: true,
        cancelButtonText: `That's not me`,
        showLoaderOnConfirm: true,
        allowOutsideClick: false
      }).then((result) => {

        if (result.dismiss == "cancel") {
          return swal({
            type: 'error',
            title: `I'm sorry!`,
            confirmButtonText: 'Will do!',
            html: `This is Luiz's fault!<br><br>Could you try again using your first and last name?<br><br>If that doesn't help send an email to luiz at luizchagasjr@gmail.com, he'll help you!`
          });
        }

        return swal({
          title: `How many people are coming?`,
          input: 'number',
          inputValue: 0,
          confirmButtonText: 'Next',
          showLoaderOnConfirm: true,
          allowOutsideClick: false
        }).then(result => {
          if (!result) {
            return;
          }

          if (result.value > user.tickets) {
            return swal({
              type: 'error',
              title: 'Mmmm!',
              html: `Could you please verify the amount of guests and try to RSVP again?`
            });
          }

          if (result.value > 0) {
            return new Promise((resolve, reject) => {
              $.ajax({
                type: "POST",
                url: '/api/confirm',
                data: {
                  person: user.name,
                  amount: user.tickets
                },
                dataType: 'JSON'
              }).then(function(data, textStatus, jqXHR) {
                swal({
                  type: 'success',
                  title: 'Wahoo!',
                  html: `Your reservation was confirmed. <br> We look forward to seeing you there!`
                });
              }, function(jqXHR, textStatus, errorThrown) {
                swal({
                  type: 'error',
                  title: 'Oh no!',
                  html: `Something went wrong! Please try again.`
                });
              });
            });
          } else {
            swal({
              title: 'Bummer!',
              html: `Thanks for letting us know!`
            });
          }
        });
      });
    } else {
      swal({
        type: 'error',
        title: 'Oops',
        html: `I couldn't find your name on the list ${result.value}!`
      });
    }
  });
}


// wow
new WOW({
  offset: 50
}).init();

// Back to Top
if ($('#back-to-top').length) {
  var scrollTrigger = 100, // px
    backToTop = function() {
      var scrollTop = $(window).scrollTop();
      if (scrollTop > scrollTrigger) {
        $('#back-to-top').addClass('show');
      } else {
        $('#back-to-top').removeClass('show');
      }
    };
  backToTop();
  $(window).on('scroll', function() {
    backToTop();
  });
  $('#back-to-top').on('click', function(e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: 0
    }, 700);
  });
}

// Gallery
document.getElementById('gallery').onclick = function(event) {
  event = event || window.event;
  var target = event.target || event.srcElement,
    link = target.src ? target.parentNode : target,
    options = {
      index: link,
      event: event
    },
    links = this.getElementsByTagName('a');
  blueimp.Gallery(links, options);
};

const RSVPList = {
  'John Matthew': 2,
  'Paul Pennekamp': 2,
  'Mike Accorsi': 2,
  'Dean Aurich': 2,
  'Ellen Pennekamp': 1,
  'Zachary Farrell': 2,
  'Peter Farrell': 1,
  'Nathan Farrell': 1,
  'Mike Farrell': 2,
  'Susie Headrick and Jacob Matthews': 2,
  'Amanda Ligget': 1,
  'Rachel Christy': 1,
  'Hannah Martin': 1,
  'Carlos Morales': 1,
  'Eli Kiboma': 1,
  'Clare Dolan': 1,
  'Brady Hendricks': 2,
  'Hanh Phung': 1,
  'Dustin Kriley': 2,
  'Bobby Pitts': 2,
  'Benjamin Stone': 6,
  'Marshall Berry': 2,
  'Sherry Lange': 1,
  'Ron Graham': 2,
  'Andrew Mullins': 2,
  'Chase Uber': 2,
  'Karis Dolenz and Dan Nichols': 2,
  'Stan Hanson': 1,
  'Michael McGuire': 6,
  'Jack Kaiser': 2,
  'Paul Wiesel': 1,
  'Pedro Ferreira': 2,
  'Keith Bullinger': 2,
  'Tom Vanduzer': 2,
  'Steve Farrell': 2,
  'Jim Frilling': 2,
  'Jordan Rice': 2,
  'Rachel Smith': 1,
  'Eli Allgood': 2,
  'Beshoy Rezek': 1,
  'Morgan McPartland': 1,
  'Robert Johnson': 1,
  'Mike Ayers': 2,
  'Ryan Vandekamp': 2,
  'Chris Bagby and Stella Vergara-Bagby': 2,
  'Melissa Newmaster': 1,
  'Janice Hanna': 2
};

function findRSVP(name) {
  const names = name.split(' ');

  let amount = 0;

  for (const key in RSVPList) {
    let found = true;
    for (const aux of names) {
      if (!key.includes(aux)) {
        found = false;
      }
    }
    if (found) {
      return {
        name: key,
        tickets: RSVPList[key]
      };
    }
  }

  return {
    tickets: 0
  };
}
