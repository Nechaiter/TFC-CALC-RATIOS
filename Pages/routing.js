function showView(view) {
  if (view === 'menu') {
    window.location.href = '/index.html';
  } else {
    window.location.href = "/Pages/"+view+'/'+view + '.html';
  }
}