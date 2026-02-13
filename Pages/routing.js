function showView(view) {
  const path = window.location.pathname;
  // /Pages/Bloomery/Bloomery.html)
  const isInsidePages = path.indexOf('Pages') > -1 || path.indexOf('pages') > -1;

  if (view === 'menu') {
    if (isInsidePages) {
      window.location.href = '../../index.html';
    } else {
      window.location.href = 'index.html'; 
    }
  } else {
    const targetPath = view + '/' + view + '.html';
    if (isInsidePages) {
      window.location.href = '../' + targetPath;
    } else {
      window.location.href = 'Pages/' + targetPath;
    }
  }
}