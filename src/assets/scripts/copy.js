(() => {
    const MIN_COPY_LENGTH = 300;
    const MAX_COPY_LENGTH = 700;
    const MAX_UNMODIFIED_LENGTH = 250;
    const sourceLink = " [Источник: https://psycareer.ru]";

    document.addEventListener("copy", (event) => {
      event.preventDefault();

      const selection = window.getSelection();
      const originalText = selection ? selection.toString() : "";

      if (!originalText) return;

      if (originalText.length <= MAX_UNMODIFIED_LENGTH) {
        event.clipboardData?.setData("text/plain", originalText);
        return;
      }

      const maxLength =
        Math.floor(Math.random() * (MAX_COPY_LENGTH - MIN_COPY_LENGTH + 1)) +
        MIN_COPY_LENGTH;

      let truncatedText = originalText.substring(0, maxLength);

      truncatedText = truncatedText.split(" ").join(" ");

      const modifiedText = truncatedText + sourceLink;

      event.clipboardData?.setData("text/plain", modifiedText);
    });
  })();