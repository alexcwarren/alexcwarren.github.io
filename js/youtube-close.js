function closeVideo() {
  var url = $('#proposal').attr('src');

  $('#proposal').attr('src','');

  $('#proposal').attr('src', url);
}
