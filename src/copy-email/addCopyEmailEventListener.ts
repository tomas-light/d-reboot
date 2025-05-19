export function addCopyEmailEventListener(options: {
  copyEmail: HTMLElement;
  email: string;
  changeState: {
    toSuccess: VoidFunction;
    toInitial: VoidFunction;
  };
}) {
  const { copyEmail, email, changeState } = options;

  let timer: ReturnType<typeof setTimeout> | null = null;

  copyEmail.addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(email);
      changeState.toSuccess();
    } finally {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        changeState.toInitial();
      }, 1000);
    }
  });
}
