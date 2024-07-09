document.addEventListener('copy', function(e) {
    e.preventDefault();
    
    var selection = window.getSelection();
    var originalText = selection.toString();

    if (!originalText) {
        return; 
    }

    const MIN_COPY_LENGTH = 300;
    const MAX_COPY_LENGTH = 500;
    const MAX_UNMODIFIED_LENGTH = 200;

    if (originalText.length <= MAX_UNMODIFIED_LENGTH) {
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', originalText);
        } else if (window.clipboardData) {
            window.clipboardData.setData('Text', originalText);
        }
        return;
    }

    var maxLength = Math.floor(Math.random() * (MAX_COPY_LENGTH - MIN_COPY_LENGTH + 1)) + MIN_COPY_LENGTH;
    var truncatedText = originalText.substring(0, maxLength);
    
    var words = truncatedText.split(' ');
    truncatedText = words.join(' ');

   
    var sourceLink = ' [Источник: https://www.psycareer.ru]';
    var modifiedText = truncatedText + sourceLink;

    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', modifiedText);
    } else if (window.clipboardData) {
        window.clipboardData.setData('Text', modifiedText);
    }
});
