;(async function() {
  const SURVEY_CONFIGURATION = await fetch("/survey.json").then(res => res.json());

  // ----- Constants & configurations
  const LOCAL_STORAGE_SURVEY_KEY = "state-of-cardano-developer-ecosystem-2025";
  const TURNSTILE_SITEKEY = ["[::1]", "127.0.0.1", "localhost"].includes(location.hostname)
    ?  "1x00000000000000000000AA"
    :  "0x4AAAAAAB4YSM5mX3jPwKvf";

  // ----- Clouflare's TurnStile configuration, for bot-detection.
  const turnstileContainer = "#cf-turnstile";
  const turnstileChallenge = new Promise((resolve, reject) => {
    turnstile.render(turnstileContainer, {
      sitekey: TURNSTILE_SITEKEY,
      callback: resolve,
      errorCallback: reject,
      expiredCallback: reject,
      execution: "execute",
    });
  });

  // ----- SurveyJS configuration
  Survey.settings.lazyRender.enabled = true;
  const survey = new Survey.Model(SURVEY_CONFIGURATION);
  survey.locale = navigator?.language ?? "en";
  survey.applyTheme({
    ...SurveyTheme.ContrastLight,
    cssVariables: {
      ...SurveyTheme.ContrastLight.cssVariables,
      "--sjs-base-unit": "9px",
      "--sjs-primary-backcolor": "#001d3e",
      "--sjs-general-backcolor-dim-light": "#ffffff",
      "--sjs-general-backcolor-dim-dark": "#ffffff",
      "--sjs-general-backcolor-dark": "#001d3e",
      "--sjs-general-backcolor-dim": "#001d3e",
      "--sjs-questionpanel-hovercolor": "#487fff",
      "--sjs-primary-backcolor-light": "#001d3e",
      "--sjs-general-dim-forecolor": "#ffffff",
      "--sjs-general-dim-forecolor-light": "#ffffff",
    }
  });

  //

  // ----- Survey progression / restoring previous session
  function saveSurveyData (survey) {
    const data = survey.data;
    data.pageNo = survey.currentPageNo;
    window.localStorage.setItem(LOCAL_STORAGE_SURVEY_KEY, JSON.stringify(data));
  }

  survey.onValueChanged.add(saveSurveyData);
  survey.onCurrentPageChanged.add(saveSurveyData);

  const prevData = window.localStorage.getItem(LOCAL_STORAGE_SURVEY_KEY) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
    }
  }

  // ----- Survey Completion
  survey.onComplete.add(async (sender, options) => {
    options.showSaveInProgress();

    if (sender.data?.question2 === "Item 5") {
      options.showSaveSuccess();
      return;
    }

    try {
      turnstile.execute(turnstileContainer);

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challenge: await turnstileChallenge,
          data: sender.data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post the survey results; the request to the backend did not succeed.");
      }

      window.localStorage.removeItem(LOCAL_STORAGE_SURVEY_KEY);

      options.showSaveSuccess();
    } catch (err) {
      options.showSaveError();
      console.log(err);
    }
  });

  // ----- Finally, render the survey
  survey.render(document.getElementById("survey"));
}());
