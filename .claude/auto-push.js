var d = '';
process.stdin.resume();
process.stdin.on('data', function(c) { d += c; });
process.stdin.on('end', function() {
  try {
    var j = JSON.parse(d);
    var f = (j.tool_input && j.tool_input.file_path) || '';
    if (!f.includes('preview-fullscreen.html')) return;
    var exec = require('child_process').execSync;
    var cwd = 'C:/Users/USUARIO/Desktop/BOVEDA/Desarrollo Web/Doctora Maria Bernarlda';
    exec('git add preview-fullscreen.html', { cwd: cwd, stdio: 'pipe' });
    exec('git commit -m "preview: update preview-fullscreen.html"', { cwd: cwd, stdio: 'pipe' });
    exec('git push origin main', { cwd: cwd, stdio: 'pipe' });
  } catch (e) {}
});
