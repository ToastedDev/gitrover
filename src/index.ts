import "isomorphic-unfetch";

import { intro, outro, text } from "@clack/prompts";

const main = async () => {
  intro("gitrover");
  await text({
    message: "What is your name?",
    placeholder: "ToastedToast",
  });
  outro("You're all set!");
};

main();
