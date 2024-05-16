const chekIsNavigationSupported = () => {
  return Boolean(document.startViewTransition);
};

const fetchPage = async (url) => {
  const reponse = await fetch(url);
  const text = await reponse.text();

  const [, data] = text.match(/<body>([\s\S]+)<\/body>/i);

  return data;
};

export const startViewTransition = () => {
  if (!chekIsNavigationSupported()) return;
  window.navigation.addEventListener("navigate", (event) => {
    const toUrl = new URL(event.detail.url);

    // Si es una pagina externa la ignoramos
    if (location.origin !== toUrl.origin) return;

    //si es una navegacion en el mismo dominio
    event.interceptor({
      async handler() {
        const data = await fetchPage(toUrl.pathname);

        document.startViewTransition(() => {
          document.body.innerHTML = data;
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
};
