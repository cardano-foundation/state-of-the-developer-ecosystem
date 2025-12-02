fetch("/state-of-the-developer-ecosystem/2025/data/answers.json").then(res => res.json()).then(rawData =>
fetch("/state-of-the-developer-ecosystem/2025/data/survey.json").then(res => res.json()).then(rawSurvey => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);

  const survey = rawSurvey.pages
    .flatMap(page => page.elements)
    .filter(question => question.type !== "html");

  // Create a map from question to choices id
  const choicesByQuestion = survey.reduce((all, question) => {
    all[question.name] = {
      type: question.type,
      title: question.title?.default ?? question.title,
      choices: question.choices?.reduce((inner, choice) => {
        inner[choice.value] = choice.text.default ?? choice.text;
        return inner;
      }, {}),
    };

    return all;
  }, {});

  const others = {};

  // Group the answers by questions; making sure that answers align (nth item
  // of each question corresponds to the same nth respondent).
  const data = rawData.reduce((acc, answer, j) => {
    for (let i = 1; i <= Object.keys(choicesByQuestion).length; i += 1) {
      const key = `question${i}`;
      const question = choicesByQuestion[key];

      if (acc[key] === undefined) {
        acc[key] = [];
      }

      function getChoice(label) {
        const choice = question.choices[label];

        if (choice === undefined) {
          if (label === "none") {
            return ["None"];
          }

          if (label === "other") {
            if (others[question.title] === undefined) {
              others[question.title] = [];
            }
            const customAnswer = answer[`${key}-Comment`];

            if (customAnswer == undefined) {
              throw new Error(`empty custom answer at index ${j} for ${key}`);
            }

            others[question.title].push(customAnswer);
            return [customAnswer];
          }

          return [];
        }

        return [choice];
      }

      switch (question.type) {
        case "multipletext": {
          const value = answer[key];
          acc[key].push(value === undefined ? [] : [Object.values(value).join(": ")]);
        }
        break;

        case "text":
        case "comment":
        case "rating": {
          const value = answer[key];
          acc[key].push(value === undefined ? [] : [value]);
        }
        break;

        case "radiogroup":
        case "dropdown":
        case "tagbox":
        case "checkbox":
        case "ranking": {
          if (Array.isArray(answer[key])) {
            acc[key].push(answer[key].flatMap(getChoice));
          } else {
            acc[key].push(getChoice(answer[key]));
          }
        }
        break;
      }
    }

    return acc;
  }, {});

  const questions = survey
    .reduce((acc, question, ix) => {
      if (!data[question.name]) { throw new Error(`Unknown question: ${question.name} - ${title}`); }

      let model = {
        title: question.title.default ?? question.title,
        answers: data[question.name],
        selectedFilter: 0,
        comment: "",
        sortDesc: true,
      };

      switch (question.type) {
        case "multipletext":
        case "text":
        case "comment":
          // [ [ String, Int, null ] ],
          model.options = [];
          model.link = "";
        break;

        case "ranking":
        case "radiogroup":
        case "dropdown":
        case "tagbox":
        case "checkbox":
          model.options = question.choices.map(choice => choice.text.default ?? choice.text);
        break;

        case "rating":
          if (question.rateType === "smileys") {
            model.minimum = "Unsatisfied";
            model.maximum = "Pleased";
          } else {
            // TODO: minimumBy(question.rateValues, rate => rate.value),
            const minimum = question.rateValues.find(() => true);
            model.minimum = minimum.text.default ?? minimum.text;

            // TODO: maximumBy(question.rateValues, rate => rate.value),
            const maximum = question.rateValues.findLast(() => true);
            model.maximum = maximum.text.default ?? maximum.text;
          }
        break;
      }

      acc[`question${ix + 1}`] = model;

      return acc;
    }, {});

  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2025",
      introduction: "Following the <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2022/'>2022</a> and <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2023/'>2023</a> editions, the third Cardano Developer Ecosystem Survey builds on the Cardano Foundation’s annual analysis. With responses from approximately 196 developers on up to 35 questions, the 2024 survey offers valuable insights into the needs and experiences of those building on Cardano.<br/><br/>This year’s survey enhancements enable a more comprehensive exploration of trends and patterns through interactive stacked bar charts, heatmaps, and other visualizations. By better showcasing key trends, these representations reinforce the Foundation’s commitment to community empowerment through transparent, open-source initiatives.<br/><br/>Further emphasizing these efforts, the complete report and the source code used to generate it remain <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem'>openly accessible <svg class='icon' style='top: 2px; position: relative;'><use xlink:href='#icon-github'/></svg></a>. We actively encourage community contributions that enable further analysis of results and suggestions for next year’s questions on <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/'>the collaborative GitHub discussion board</a>. The Foundation thanks all those who participated in the 2024 survey and hopes to generate even more interest for next year’s fourth edition.",
      questions,
    }
  });

  // Quick-n-dirty hack to get anchors working without the hassle of handling
  // the Browser.Navigation in-app ¯\_(ツ)_/¯.
  //
  // Please don't judge me too harshly.
  const anchor = location.hash;
  if (anchor != undefined && anchor !== '') {
    requestAnimationFrame(function step () {
      const el = document.querySelector(anchor);
      if (el == null) { return requestAnimationFrame(step); }
      el.scrollIntoView();
    });
  }

  // Synchronize the menu scroll with the content scroll on compatible browsers.
  const html = document.querySelector('html');
  if (html.scrollTopMax) {
    requestAnimationFrame(function step() {
      const nav = document.querySelector('nav');
      if (nav == null) { return requestAnimationFrame(step); }
      nav.addEventListener('scroll', e => {
        html.scrollTop = Math.floor(nav.scrollTop * html.scrollTopMax / nav.scrollTopMax);
      });
    });
  }
}));
