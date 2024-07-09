document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".video");

  videos.forEach((video) => {
    setupVideo(video);
  });

  function parseMediaURL(link) {
    const regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
    const url = link.href;
    const match = url.match(regexp);

    return match ? match[1] : null;
  }

  function setupVideo(video) {
    const link = video.querySelector(".video__link");
    const id = parseMediaURL(link);

    if (!id) {
      return;
    }

    video.addEventListener("click", (event) => {
      event.preventDefault();
      const iframe = createIframe(id);
      link.remove();
      video.querySelector(".video__button").remove();
      video.appendChild(iframe);
    });

    video.classList.add("video--enabled");
  }

  function createIframe(id) {
    const iframe = document.createElement("iframe");
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay";
    iframe.src = generateURL(id);
    iframe.classList.add("video__media");

    return iframe;
  }

  function generateURL(id) {
    const query = "?rel=0&showinfo=0&autoplay=1";
    return `https://www.youtube-nocookie.com/embed/${id}${query}`;
  }
});
