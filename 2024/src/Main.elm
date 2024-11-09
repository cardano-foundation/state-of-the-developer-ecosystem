{-
   This little application is used to display the survey results. Note that it
   was designed in haste and without all the love and care that would go into a
   proper application design. Some of the high-level types are unsound and there
   are likely more elegant ways to do what this application achieves. Yet, it
   works for the purpose of showing the data and was fast-enough to prototype and
   iterate upon.

   All-in-all, it's open source and can be improved through contributions.
-}


module Main exposing (..)

import Array exposing (Array)
import Browser
import Dict
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Lazy
import List.Extra as List
import Markdown exposing (defaultOptions)
import Slug
import Svg
import Svg.Attributes


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Model


type alias Flags =
    { title : String
    , introduction : String
    , questions : Questionnaire
    }


type alias Model =
    { title : String
    , introduction : String
    , questions : Questionnaire
    , displayOption : DisplayOption
    }


type alias Questionnaire =
    -- How many years of experience do you have writing/deploying software?
    { question1 : MultipleChoices

    -- How many years of experience do you have writing software using a functional programming stack?
    , question2 : MultipleChoices

    -- How many years of experience do you have writing/deploying software in the blockchain industry?
    , question3 : MultipleChoices

    -- Do you work on Cardano as a hobby or professionally?
    , question4 : MultipleChoices

    -- Did you ever contribute, write, or deploy software in other blockchain ecosystems?
    , question5 : MultipleChoices

    -- Which other blockchain ecosystem(s) are you the most familiar with?
    , question6 : MultipleChoices

    -- Which best describes your current profession?"
    , question7 : MultipleChoices

    -- What is your main development environment?
    , question8 : MultipleChoices

    -- Which programming language(s) are you proficient in?
    , question9 : MultipleChoices

    -- How would you rate your technical understanding of Cardano?
    , question10 : Scale

    -- What is the biggest priority on the Cardano technical roadmap?
    , question11 : Ranking

    -- What do you use (or plan to use) for writing Plutus script validators / smart contracts?
    , question12 : MultipleChoices

    -- What language(s) do you use (or plan to use) for writing off-chain code?
    , question13 : MultipleChoices

    -- How satisfied are you with the current state of the smart contract ecosystem?
    , question14 : Scale

    -- Which category of Cardano decentralized applications (DApps) are you currently working on or most interested in?
    , question15 : MultipleChoices

    -- Which libraries do you use in your projects?
    , question16 : MultipleChoices

    -- It would be nice if a library in … implemented … ?
    , question17 : Open

    -- Which services do you use in your projects?
    , question18 : MultipleChoices

    -- It would be nice if a service provided … ?
    , question19 : Open

    -- Which hosted service(s)/platform(s) do you use in your projects?
    , question20 : MultipleChoices

    -- How do you prefer interacting with a local or remote service?
    , question21 : MultipleChoices

    -- Which command-line tool(s) do you use in your projects?
    , question22 : MultipleChoices

    -- It would be nice if there were a CLI for … ?
    , question23 : Open

    -- Which type of infrastructure do you currently use or prefer for deploying DApps/blockchain applications?
    , question24 : MultipleChoices

    -- How would you prefer to consume software?
    , question25 : MultipleChoices

    -- What do you think is the greatest asset of Cardano’s developer ecosystem?
    , question26 : Open

    -- "What do you think is the biggest pain point of Cardano's developer ecosystem?": [
    , question27 : Open

    -- Select any statement that applies to you․
    , question28 : MultipleChoices

    -- Where do you usually seek help on technical issues?
    , question29 : MultipleChoices

    -- Where/how do you look for technical details on Cardano?
    , question30 : MultipleChoices

    -- On average, how satisfied are you with the technical answers/details you find in documentation and within the community?
    , question31 : Scale

    -- Which language(s) do you prefer to consume documentation and educational content in?
    , question32 : MultipleChoices

    -- Did you attend the Cardano Buidler Fest in April 2024?
    , question33 : YesNo

    -- How satisfied were you with the Cardano Buidler Fest?
    , question34 : Scale

    -- Do you have any ideas on how to improve the next potential Cardano Buidler Fest?
    , question35 : Open
    }


type DisplayOption
    = DisplayRelative
    | DisplayTotal


type alias Filter a =
    { title : String
    , function : List (List a) -> List (List a)
    }


type alias BarChart a =
    { title : String
    , comment : String
    , answers : List (List a)
    , options : List ( String, a )
    , sortDesc : Bool
    , additionalFilters : List (Filter a)
    , selectedFilter : Int
    }


type alias StackBarChart =
    { title : String
    , answers : List (Array String)
    , options : List String
    }


type alias Ranking =
    { title : String
    , comment : String
    , answers : List (Array String)
    , options : List String
    , sortDesc : Bool
    , selectedFilter : Int
    }


type alias MultipleChoices =
    { title : String
    , comment : String
    , answers : List (List String)
    , options : List String
    , sortDesc : Bool
    , selectedFilter : Int
    , singleChoice : Bool
    }


type alias YesNo =
    { title : String
    , comment : String
    , answers : List (List Bool)
    , selectedFilter : Int
    }


type alias Scale =
    { title : String
    , comment : String
    , answers : List (List Int)
    , minimum : String
    , maximum : String
    , selectedFilter : Int
    }


type alias Open =
    { title : String
    , comment : String
    , link : String
    , options : List ( String, Int, Maybe String )
    , answers : List (List String)
    }


init : Flags -> ( Model, Cmd Msg )
init { title, introduction, questions } =
    ( { title = title
      , introduction = introduction
      , questions = questions
      , displayOption = DisplayTotal
      }
    , Cmd.none
    )



-- Updates


type Msg
    = ChangeDisplayOption DisplayOption
    | ChangeFilter (Model -> Model)
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeDisplayOption displayOption ->
            ( { model | displayOption = displayOption }
            , Cmd.none
            )

        ChangeFilter applyUpdate ->
            ( applyUpdate model
            , Cmd.none
            )

        NoOp ->
            ( model
            , Cmd.none
            )


noUpdate : { selectedFilter : Int } -> Msg
noUpdate =
    always NoOp


updateQuestion1 :
    { selectedFilter : Int }
    -> Msg
updateQuestion1 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question1
            in
            { model | questions = { questions | question1 = { q | selectedFilter = selectedFilter } } }


updateQuestion2 :
    { selectedFilter : Int }
    -> Msg
updateQuestion2 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question2
            in
            { model | questions = { questions | question2 = { q | selectedFilter = selectedFilter } } }


updateQuestion3 :
    { selectedFilter : Int }
    -> Msg
updateQuestion3 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question3
            in
            { model | questions = { questions | question3 = { q | selectedFilter = selectedFilter } } }


updateQuestion4 :
    { selectedFilter : Int }
    -> Msg
updateQuestion4 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question4
            in
            { model | questions = { questions | question4 = { q | selectedFilter = selectedFilter } } }


updateQuestion5 :
    { selectedFilter : Int }
    -> Msg
updateQuestion5 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question5
            in
            { model | questions = { questions | question5 = { q | selectedFilter = selectedFilter } } }


updateQuestion6 :
    { selectedFilter : Int }
    -> Msg
updateQuestion6 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question6
            in
            { model | questions = { questions | question6 = { q | selectedFilter = selectedFilter } } }


updateQuestion7 :
    { selectedFilter : Int }
    -> Msg
updateQuestion7 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question7
            in
            { model | questions = { questions | question7 = { q | selectedFilter = selectedFilter } } }


updateQuestion8 :
    { selectedFilter : Int }
    -> Msg
updateQuestion8 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question8
            in
            { model | questions = { questions | question8 = { q | selectedFilter = selectedFilter } } }


updateQuestion9 :
    { selectedFilter : Int }
    -> Msg
updateQuestion9 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question9
            in
            { model | questions = { questions | question9 = { q | selectedFilter = selectedFilter } } }


updateQuestion10 :
    { selectedFilter : Int }
    -> Msg
updateQuestion10 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question10
            in
            { model | questions = { questions | question10 = { q | selectedFilter = selectedFilter } } }


updateQuestion11 :
    { selectedFilter : Int }
    -> Msg
updateQuestion11 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question11
            in
            { model | questions = { questions | question11 = { q | selectedFilter = selectedFilter } } }


updateQuestion12 :
    { selectedFilter : Int }
    -> Msg
updateQuestion12 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question12
            in
            { model | questions = { questions | question12 = { q | selectedFilter = selectedFilter } } }


updateQuestion13 :
    { selectedFilter : Int }
    -> Msg
updateQuestion13 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question13
            in
            { model | questions = { questions | question13 = { q | selectedFilter = selectedFilter } } }


updateQuestion14 :
    { selectedFilter : Int }
    -> Msg
updateQuestion14 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question14
            in
            { model | questions = { questions | question14 = { q | selectedFilter = selectedFilter } } }


updateQuestion15 :
    { selectedFilter : Int }
    -> Msg
updateQuestion15 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question15
            in
            { model | questions = { questions | question15 = { q | selectedFilter = selectedFilter } } }


updateQuestion16 :
    { selectedFilter : Int }
    -> Msg
updateQuestion16 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question16
            in
            { model | questions = { questions | question16 = { q | selectedFilter = selectedFilter } } }


updateQuestion18 :
    { selectedFilter : Int }
    -> Msg
updateQuestion18 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question18
            in
            { model | questions = { questions | question18 = { q | selectedFilter = selectedFilter } } }


updateQuestion20 :
    { selectedFilter : Int }
    -> Msg
updateQuestion20 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question20
            in
            { model | questions = { questions | question20 = { q | selectedFilter = selectedFilter } } }


updateQuestion22 :
    { selectedFilter : Int }
    -> Msg
updateQuestion22 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question22
            in
            { model | questions = { questions | question22 = { q | selectedFilter = selectedFilter } } }


updateQuestion24 :
    { selectedFilter : Int }
    -> Msg
updateQuestion24 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question24
            in
            { model | questions = { questions | question24 = { q | selectedFilter = selectedFilter } } }


updateQuestion25 :
    { selectedFilter : Int }
    -> Msg
updateQuestion25 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question25
            in
            { model | questions = { questions | question25 = { q | selectedFilter = selectedFilter } } }


updateQuestion28 :
    { selectedFilter : Int }
    -> Msg
updateQuestion28 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question28
            in
            { model | questions = { questions | question28 = { q | selectedFilter = selectedFilter } } }


updateQuestion29 :
    { selectedFilter : Int }
    -> Msg
updateQuestion29 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question29
            in
            { model | questions = { questions | question29 = { q | selectedFilter = selectedFilter } } }


updateQuestion30 :
    { selectedFilter : Int }
    -> Msg
updateQuestion30 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question30
            in
            { model | questions = { questions | question30 = { q | selectedFilter = selectedFilter } } }


updateQuestion31 :
    { selectedFilter : Int }
    -> Msg
updateQuestion31 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question31
            in
            { model | questions = { questions | question31 = { q | selectedFilter = selectedFilter } } }


updateQuestion32 :
    { selectedFilter : Int }
    -> Msg
updateQuestion32 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question32
            in
            { model | questions = { questions | question32 = { q | selectedFilter = selectedFilter } } }


updateQuestion33 :
    { selectedFilter : Int }
    -> Msg
updateQuestion33 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question33
            in
            { model | questions = { questions | question33 = { q | selectedFilter = selectedFilter } } }


updateQuestion34 :
    { selectedFilter : Int }
    -> Msg
updateQuestion34 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question34
            in
            { model | questions = { questions | question34 = { q | selectedFilter = selectedFilter } } }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- Views


view : Model -> Html Msg
view ({ title, introduction, questions } as model) =
    Html.node "main"
        []
        [ Html.nav
            []
            [ Html.a
                [ Html.Attributes.href "#"
                , Html.Attributes.alt "Back to top"
                ]
                [ Html.img
                    [ Html.Attributes.src "assets/img/cardano.svg"
                    , Html.Attributes.alt "Cardano Logo"
                    ]
                    []
                ]
            , Html.ul []
                [ viewMenuLink questions.question1
                , viewMenuLink questions.question2
                , viewMenuLink questions.question3
                , viewMenuLink questions.question4
                , viewMenuLink questions.question5
                , viewMenuLink questions.question6
                , viewMenuLink questions.question7
                , viewMenuLink questions.question8
                , viewMenuLink questions.question9
                , viewMenuLink questions.question10
                , viewMenuLink questions.question11
                , viewMenuLink questions.question12
                , viewMenuLink questions.question13
                , viewMenuLink questions.question14
                , viewMenuLink questions.question15
                , viewMenuLink questions.question16
                , viewMenuLink questions.question17
                , viewMenuLink questions.question18
                , viewMenuLink questions.question19
                , viewMenuLink questions.question20
                , viewMenuLink questions.question21
                , viewMenuLink questions.question22
                , viewMenuLink questions.question23
                , viewMenuLink questions.question24
                , viewMenuLink questions.question25
                , viewMenuLink questions.question26
                , viewMenuLink questions.question27
                , viewMenuLink questions.question28
                , viewMenuLink questions.question29
                , viewMenuLink questions.question30
                , viewMenuLink questions.question31
                , viewMenuLink questions.question32
                , viewMenuLink questions.question33
                , viewMenuLink questions.question34
                , viewMenuLink questions.question35
                ]
            ]
        , Html.h1
            []
            [ Html.img
                [ Html.Attributes.class "mobile"
                , Html.Attributes.src "assets/img/cardano.svg"
                , Html.Attributes.alt "Cardano Logo"
                ]
                []
            , Html.text title
            ]
        , Markdown.toHtmlWith { defaultOptions | sanitize = False } [ Html.Attributes.class "introduction" ] introduction
        , viewMultipleChoices model questions.question1
        , viewMultipleChoices model questions.question2
        , viewMultipleChoices model questions.question3
        , viewMultipleChoicesWith
            model
            updateQuestion4
            questions.question4
            []
        , viewMultipleChoicesWith
            model
            updateQuestion5
            questions.question5
            []
        , viewMultipleChoicesWith
            model
            updateQuestion6
            questions.question6
            []
        , viewMultipleChoicesWith
            model
            updateQuestion7
            questions.question7
            []
        , viewMultipleChoicesWith
            model
            updateQuestion8
            questions.question8
            []
        , viewMultipleChoicesWith model
            updateQuestion9
            questions.question9
            []
        , viewScale model questions.question10
        , viewRankingWith
            model
            updateQuestion11
            questions.question11
            []
        , viewMultipleChoicesWith
            model
            updateQuestion12
            questions.question12
            []
        , viewMultipleChoicesWith
            model
            updateQuestion13
            questions.question13
            []
        , viewScaleWith model updateQuestion14 [] questions.question14
        , viewMultipleChoicesWith
            model
            updateQuestion15
            questions.question15
            []
        , viewMultipleChoicesWith
            model
            updateQuestion16
            questions.question16
            []
        , viewOpen model questions.question17
        , viewMultipleChoicesWith
            model
            updateQuestion18
            questions.question18
            []
        , viewOpen model questions.question19
        , viewMultipleChoicesWith
            model
            updateQuestion20
            questions.question20
            []
        , viewMultipleChoices model questions.question21
        , viewMultipleChoicesWith
            model
            updateQuestion22
            questions.question22
            []
        , viewOpen model questions.question23
        , viewMultipleChoices model questions.question24
        , viewMultipleChoices model questions.question25
        , viewOpen model questions.question26
        , viewOpen model questions.question27
        , viewMultipleChoices model questions.question28
        , viewMultipleChoices model questions.question29
        , viewMultipleChoices model questions.question30
        , viewScale model questions.question31
        , viewMultipleChoices model questions.question32
        , viewYesNo model questions.question33
        , viewScale model questions.question34
        , viewOpen model questions.question35
        ]


viewMultipleChoices :
    Model
    -> MultipleChoices
    -> Html Msg
viewMultipleChoices model q =
    viewMultipleChoicesWith model noUpdate q []


viewMultipleChoicesWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> MultipleChoices
    -> List (Filter String)
    -> Html Msg
viewMultipleChoicesWith model toMsg { title, comment, options, answers, sortDesc, selectedFilter, singleChoice } additionalFilters =
    viewBarChart
        model
        toMsg
        singleChoice
        { title = title
        , comment = comment
        , answers = answers
        , options = List.map (\x -> ( x, x )) options
        , sortDesc = sortDesc
        , selectedFilter = selectedFilter
        , additionalFilters = additionalFilters
        }


viewRankingWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> Ranking
    -> List (Filter String)
    -> Html Msg
viewRankingWith model _ { title, comment, options, answers, sortDesc, selectedFilter } additionalFilters =
    viewStackBarChart
        model
        { title = title
        , answers = answers
        , options = options
        }


viewYesNo :
    Model
    -> YesNo
    -> Html Msg
viewYesNo model =
    viewYesNoWith model noUpdate []


viewYesNoWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter Bool)
    -> YesNo
    -> Html Msg
viewYesNoWith model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, answers, comment, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter (total answers) :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault (defaultFilter <| total answers)
                        |> (\{ function } -> function answers)

                data =
                    List.foldr
                        (\answer st ->
                            if answer == [ True ] then
                                { st | yes = st.yes + 1 }

                            else if answer == [ False ] then
                                { st | no = st.no + 1 }

                            else
                                st
                        )
                        { yes = 0, no = 0 }
                        filteredAnswers

                yMax =
                    total filteredAnswers
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (total answers)
                , Html.div
                    [ Html.Attributes.class "pie"
                    , Html.Attributes.attribute "data-yes"
                        (case model.displayOption of
                            DisplayTotal ->
                                String.fromInt data.yes

                            DisplayRelative ->
                                displayPercent yMax data.yes
                        )
                    , Html.Attributes.attribute "data-no"
                        (case model.displayOption of
                            DisplayTotal ->
                                String.fromInt data.no

                            DisplayRelative ->
                                displayPercent yMax data.no
                        )
                    , Html.Attributes.style "background-image" <|
                        String.join " "
                            [ "conic-gradient(var(--color-primary)"
                            , displayPercent yMax data.yes
                            , ", var(--color-background)"
                            , displayPercent yMax data.yes
                            ]
                    ]
                    []
                , viewQuestionFooter comment
                ]


viewScale :
    Model
    -> Scale
    -> Html Msg
viewScale model q =
    viewScaleWith model noUpdate [] q


viewScaleWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter Int)
    -> Scale
    -> Html Msg
viewScaleWith model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, answers, comment, minimum, maximum, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter (total answers) :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault (defaultFilter <| total answers)
                        |> (\{ function } -> function answers)
                        |> List.filterMap List.head
                        |> List.sort
                        |> Array.fromList

                len =
                    Array.length filteredAnswers

                minValue =
                    filteredAnswers |> Array.get 0 |> Maybe.withDefault 0

                maxValue =
                    filteredAnswers |> Array.get (len - 1) |> Maybe.withDefault 10

                median =
                    if remainderBy len 2 == 0 then
                        filteredAnswers
                            |> Array.get ((len - 1) // 2)
                            |> Maybe.withDefault 0
                            |> toFloat

                    else
                        let
                            half =
                                len // 2

                            sup =
                                filteredAnswers |> Array.get half |> Maybe.withDefault 10

                            inf =
                                filteredAnswers |> Array.get (half - 1) |> Maybe.withDefault 0
                        in
                        (toFloat sup + toFloat inf) / 2

                q1 =
                    filteredAnswers
                        |> Array.get (ceiling (toFloat len / 4))
                        |> Maybe.withDefault 0

                q3 =
                    filteredAnswers
                        |> Array.get (ceiling (3 * toFloat len / 4))
                        |> Maybe.withDefault 10

                position n =
                    String.fromInt (n * 10) ++ "%"
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (total answers)
                , Html.div
                    [ Html.Attributes.class "box-plot"
                    ]
                    [ Html.div
                        [ Html.Attributes.class "whisker"
                        , Html.Attributes.style "left" <| "calc(" ++ position minValue ++ " - 0.1rem)"
                        ]
                        []
                    , Html.div
                        [ Html.Attributes.class "link"
                        , Html.Attributes.style "width" <| position (q1 - minValue)
                        , Html.Attributes.style "left" <| position minValue
                        ]
                        []
                    , Html.div
                        [ Html.Attributes.class "box"
                        , Html.Attributes.style "left" <| position q1
                        , Html.Attributes.style "width" <| position (q3 - q1)
                        ]
                        []
                    , Html.div
                        [ Html.Attributes.class "median"
                        , Html.Attributes.style "left" <| "calc(" ++ String.fromFloat (median * 10) ++ "% - 0.125rem)"
                        , Html.Attributes.style "width" "0.25rem"
                        ]
                        []
                    , Html.div
                        [ Html.Attributes.class "link"
                        , Html.Attributes.style "width" <| position (maxValue - q3)
                        , Html.Attributes.style "left" <| position q3
                        ]
                        []
                    , Html.div
                        [ Html.Attributes.class "whisker"
                        , Html.Attributes.style "left" <| "calc(" ++ position maxValue ++ " - 0.1rem)"
                        ]
                        []
                    ]
                , Html.div
                    [ Html.Attributes.class "scale"
                    ]
                    (List.range 0 10
                        |> List.map
                            (\ix ->
                                Html.div
                                    (Html.Attributes.class "bucket"
                                        :: (case ix of
                                                0 ->
                                                    [ Html.Attributes.class "labelled", Html.Attributes.attribute "data-label" minimum ]

                                                10 ->
                                                    [ Html.Attributes.class "labelled", Html.Attributes.attribute "data-label" maximum ]

                                                _ ->
                                                    []
                                           )
                                    )
                                    [ Html.text (String.fromInt ix) ]
                            )
                    )
                , viewQuestionFooter comment
                ]



--    viewBarChart
--        model
--        toMsg
--        True
--        { title = title
--        , comment = comment
--        , answers = answers
--        , options =
--            List.concat
--                [ [ ( "10 (" ++ maximum ++ ")", 10 ) ]
--                , List.range 2 9 |> List.map (\n -> ( String.fromInt n, n )) |> List.reverse
--                , [ ( "1 (" ++ minimum ++ ")", 1 ) ]
--                ]
--        , sortDesc = False
--        , selectedFilter = selectedFilter
--        , additionalFilters = additionalFilters
--        , footnote =
--            Just
--                (\totalFilteredAnswers filteredAnswers ->
--                    let
--                        mean =
--                            toFloat (List.sum (List.map List.sum filteredAnswers)) / toFloat totalFilteredAnswers
--                    in
--                    String.join " "
--                        [ "Arithmetic mean = "
--                        , (10 * mean) |> truncate |> (\x -> String.fromInt (x // 10) ++ "." ++ String.fromInt (x - 10 * (x // 10)))
--                        ]
--                )
--        }


viewOpen :
    Model
    -> Open
    -> Html Msg
viewOpen model =
    Html.Lazy.lazy <|
        \{ title, options, comment, link } ->
            let
                data =
                    options
                        |> List.map (\( label, y, extraLink ) -> { x = { label = label, link = extraLink }, y = y })
                        |> List.sortBy (\{ y } -> -y)

                yMax =
                    List.foldr (\( _, y, _ ) n -> y + n) 0 options
            in
            Html.article
                []
                [ viewQuestionTitle title
                , Html.aside
                    []
                    [ Html.div
                        []
                        [ Html.button
                            [ Html.Events.onClick (ChangeDisplayOption DisplayRelative)
                            , Html.Attributes.class <|
                                case model.displayOption of
                                    DisplayRelative ->
                                        "active"

                                    DisplayTotal ->
                                        ""
                            ]
                            [ Html.text "relative (%)" ]
                        , Html.button
                            [ Html.Events.onClick (ChangeDisplayOption DisplayTotal)
                            , Html.Attributes.class <|
                                case model.displayOption of
                                    DisplayRelative ->
                                        ""

                                    DisplayTotal ->
                                        "active"
                            ]
                            [ Html.text "total" ]
                        ]
                    , Html.span
                        [ Html.Attributes.class "see-all" ]
                        [ Html.text <| String.fromInt yMax ++ " answers "
                        , Html.a
                            [ Html.Attributes.href link
                            , Html.Attributes.target "_blank"
                            ]
                            [ Html.text "(see all)"
                            , Svg.svg
                                [ Svg.Attributes.class "icon"
                                ]
                                [ Svg.use [ Svg.Attributes.xlinkHref "#icon-external-link" ] [] ]
                            ]
                        ]
                    ]
                , Html.ul
                    [ Html.Attributes.class "bars" ]
                    (data
                        |> List.map
                            (\{ x, y } ->
                                Html.li
                                    []
                                    [ Html.label [] <|
                                        case x.link of
                                            Nothing ->
                                                [ Markdown.toHtmlWith { defaultOptions | sanitize = False } [] x.label ]

                                            Just href ->
                                                [ Markdown.toHtmlWith { defaultOptions | sanitize = False } [] x.label
                                                , Html.a
                                                    [ Html.Attributes.href href
                                                    , Html.Attributes.target "_blank"
                                                    , Html.Attributes.style "font-size" "0.8em"
                                                    , Html.Attributes.style "position" "relative"
                                                    , Html.Attributes.style "top" "-0.5em"
                                                    ]
                                                    [ Svg.svg
                                                        [ Svg.Attributes.class "icon"
                                                        ]
                                                        [ Svg.use [ Svg.Attributes.xlinkHref "#icon-external-link" ] [] ]
                                                    ]
                                                ]
                                    , Html.div []
                                        [ Html.div
                                            [ Html.Attributes.class "bar"
                                            , Html.Attributes.style "width" (displayPercent yMax y)
                                            ]
                                            []
                                        , Html.label
                                            []
                                            [ Html.text <|
                                                case model.displayOption of
                                                    DisplayTotal ->
                                                        String.fromInt y

                                                    DisplayRelative ->
                                                        displayPercent yMax y
                                            ]
                                        ]
                                    ]
                            )
                    )
                , Markdown.toHtmlWith { defaultOptions | sanitize = False } [] comment
                ]


viewStackBarChart :
    Model
    -> StackBarChart
    -> Html Msg
viewStackBarChart model =
    Html.Lazy.lazy <|
        \{ title, options, answers } ->
            let
                filteredAnswers =
                    answers

                comment =
                    ""

                data =
                    buildStackBarChart
                        { options = options
                        , answers = filteredAnswers
                        }
            in
            Html.article
                []
                [ viewQuestionTitle title
                , Html.aside
                    []
                    [ Html.div
                        []
                        [ Html.button
                            [ Html.Events.onClick (ChangeDisplayOption DisplayRelative)
                            , Html.Attributes.class <|
                                case model.displayOption of
                                    DisplayRelative ->
                                        "active"

                                    DisplayTotal ->
                                        ""
                            ]
                            [ Html.text "relative (%)" ]
                        , Html.button
                            [ Html.Events.onClick (ChangeDisplayOption DisplayTotal)
                            , Html.Attributes.class <|
                                case model.displayOption of
                                    DisplayRelative ->
                                        ""

                                    DisplayTotal ->
                                        "active"
                            ]
                            [ Html.text "total" ]
                        , Html.span
                            [ Html.Attributes.class "filters" ]
                            [ Html.text <| String.fromInt (totalWith Array.length answers) ++ " answers" ]
                        ]
                    ]
                , Html.div [ Html.Attributes.class "stack-legend" ] []
                , Html.p [ Html.Attributes.class "stack-explainer", Html.Attributes.class "footnote" ]
                    [ Html.text "The results presented below are ordered using a "
                    , Html.a [ Html.Attributes.href "https://en.wikipedia.org/wiki/Condorcet_method" ] [ Html.text "Condorcet method" ]
                    , Html.text ". Options rank higher if they are preferred by a higher number of voters when compared head-to-head."
                    ]
                , Html.ul
                    [ Html.Attributes.class "bars", Html.Attributes.class "stack" ]
                    (data
                        |> List.map
                            (\{ x, ys } ->
                                let
                                    yMax =
                                        totalWith Array.length filteredAnswers
                                in
                                Html.li
                                    []
                                    [ Html.label [] [ Html.text x ]
                                    , Html.div [] <|
                                        List.indexedMap
                                            (\i ( y, palette ) ->
                                                Html.div
                                                    [ Html.Attributes.class "stack"
                                                    , Html.Attributes.style "width" (displayPercent yMax y)
                                                    , Html.Attributes.attribute "data-rank" (String.fromInt (i + 1))
                                                    , Html.Attributes.attribute "data-palette" (String.fromInt palette)
                                                    , Html.Attributes.attribute "data-label" <|
                                                        case model.displayOption of
                                                            DisplayTotal ->
                                                                String.fromInt y

                                                            DisplayRelative ->
                                                                displayPercent yMax y
                                                    ]
                                                    []
                                            )
                                            ys
                                    ]
                            )
                    )
                , Markdown.toHtmlWith { defaultOptions | sanitize = False } [] comment
                ]


viewBarChart :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> Bool
    -> BarChart a
    -> Html Msg
viewBarChart model toMsg singleChoice =
    Html.Lazy.lazy <|
        \{ title, options, answers, comment, sortDesc, selectedFilter, additionalFilters } ->
            let
                filters =
                    Array.fromList (defaultFilter (total answers) :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault (defaultFilter <| total answers)
                        |> (\{ function } -> function answers)

                data =
                    buildBarChart
                        { options = options
                        , answers = filteredAnswers
                        , sortDesc = sortDesc
                        }
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (total answers)
                , Html.ul
                    [ Html.Attributes.class "bars" ]
                    (data
                        |> List.filterMap
                            (\{ x, y } ->
                                if y == 0 then
                                    Nothing

                                else
                                    Just <|
                                        let
                                            yMax =
                                                total filteredAnswers
                                        in
                                        Html.li
                                            []
                                            [ Html.label [] [ Html.text x ]
                                            , Html.div []
                                                [ Html.div
                                                    [ Html.Attributes.class "bar"
                                                    , Html.Attributes.class
                                                        (if singleChoice then
                                                            "single-choice"

                                                         else
                                                            "multiple-choice"
                                                        )
                                                    , Html.Attributes.style "width" (displayPercent yMax y)
                                                    ]
                                                    []
                                                , Html.label
                                                    []
                                                    [ Html.text <|
                                                        case model.displayOption of
                                                            DisplayTotal ->
                                                                String.fromInt y

                                                            DisplayRelative ->
                                                                displayPercent yMax y
                                                    ]
                                                ]
                                            ]
                            )
                    )
                , viewQuestionFooter comment
                ]


viewQuestionTitle : String -> Html a
viewQuestionTitle title =
    let
        slug =
            title
                |> Slug.generate
                |> Maybe.map Slug.toString
    in
    Html.h2
        (case slug of
            Just str ->
                [ Html.Attributes.id str ]

            Nothing ->
                []
        )
        [ Html.a
            [ Html.Attributes.href ("#" ++ Maybe.withDefault "" slug)
            , Html.Attributes.class "anchor"
            ]
            [ Svg.svg
                [ Svg.Attributes.class "icon" ]
                [ Svg.use [ Svg.Attributes.xlinkHref "#icon-link" ] [] ]
            ]
        , Html.span [ Html.Attributes.class "number" ] [ Html.text "." ]
        , Html.text title
        ]


viewQuestionControls :
    ({ selectedFilter : Int } -> Msg)
    -> DisplayOption
    -> Array (Filter a)
    -> Int
    -> Html Msg
viewQuestionControls toMsg displayOption filters totalAnswers =
    Html.aside
        []
        (Html.div
            []
            [ Html.button
                [ Html.Events.onClick (ChangeDisplayOption DisplayRelative)
                , Html.Attributes.class <|
                    case displayOption of
                        DisplayRelative ->
                            "active"

                        DisplayTotal ->
                            ""
                ]
                [ Html.text "relative (%)" ]
            , Html.button
                [ Html.Events.onClick (ChangeDisplayOption DisplayTotal)
                , Html.Attributes.class <|
                    case displayOption of
                        DisplayRelative ->
                            ""

                        DisplayTotal ->
                            "active"
                ]
                [ Html.text "total" ]
            ]
            :: (if Array.length filters > 1 then
                    [ Html.select
                        [ Html.Attributes.class "filters"
                        , Html.Events.onInput <|
                            \str ->
                                case String.toInt str of
                                    Nothing ->
                                        toMsg { selectedFilter = 0 }

                                    Just ix ->
                                        toMsg { selectedFilter = ix }
                        ]
                        (filters
                            |> Array.indexedMap
                                (\ix f ->
                                    Html.option
                                        [ Html.Attributes.value (String.fromInt ix)
                                        ]
                                        [ Html.text f.title ]
                                )
                            |> Array.toList
                        )
                    ]

                else
                    [ Html.span
                        [ Html.Attributes.class "filters" ]
                        [ Html.text <| String.fromInt totalAnswers ++ " answers" ]
                    ]
               )
        )


viewQuestionFooter : String -> Html Msg
viewQuestionFooter =
    Markdown.toHtmlWith { defaultOptions | sanitize = False } []


viewMenuLink : { r | title : String } -> Html a
viewMenuLink { title } =
    let
        slug =
            title
                |> Slug.generate
                |> Maybe.map Slug.toString
    in
    Html.li []
        [ Html.a
            [ Html.Attributes.href ("#" ++ Maybe.withDefault "" slug)
            ]
            [ Html.text title
            ]
        ]



-- Filters


defaultFilter : Int -> Filter a
defaultFilter n =
    { title = "All answers (" ++ String.fromInt n ++ ")"
    , function = identity
    }



-- Helpers


buildStackBarChart :
    { options : List String, answers : List (Array String) }
    -> List { x : String, ys : List ( Int, Int ) }
buildStackBarChart { options, answers } =
    let
        len =
            List.length options

        zero =
            options
                |> List.map (\opt -> ( opt, Array.repeat len 0 ))
                |> Dict.fromList

        condorcet a b =
            -1
                * List.foldl
                    (\items count ->
                        count
                            + (if indexOf 0 a items < indexOf 0 b items then
                                1

                               else
                                0
                              )
                    )
                    0
                    answers

        indexOf ix x xs =
            if ix >= len then
                -1

            else if Array.get ix xs == Just x then
                ix

            else
                indexOf (ix + 1) x xs

        byRank n a b =
            if n >= len then
                EQ

            else
                let
                    at i array =
                        Array.get i array |> Maybe.withDefault 0
                in
                case compare (at n a) (at n b) of
                    EQ ->
                        byRank (n + 1) a b

                    LT ->
                        GT

                    GT ->
                        LT

        stack =
            answers
                |> List.foldl
                    (\ranking ranks ->
                        Tuple.first <|
                            Array.foldl
                                (\answer ( acc, ix ) ->
                                    ( acc
                                        |> Dict.update
                                            answer
                                            (Maybe.map
                                                (\buckets ->
                                                    let
                                                        count =
                                                            Array.get ix buckets
                                                                |> Maybe.withDefault 0
                                                    in
                                                    buckets
                                                        |> Array.set ix (count + 1)
                                                )
                                            )
                                    , ix + 1
                                    )
                                )
                                ( ranks, 0 )
                                ranking
                    )
                    zero

        ( globalMin, globalMax ) =
            Dict.foldl
                (\_ v ( currentMin, currentMax ) ->
                    let
                        xs =
                            Array.toList v
                    in
                    ( List.minimum xs |> Maybe.withDefault len |> min currentMin
                    , List.maximum xs |> Maybe.withDefault 0 |> max currentMax
                    )
                )
                ( len, 0 )
                stack

        scale =
            (toFloat globalMax - toFloat globalMin) / 15
    in
    stack
        |> Dict.toList
        |> List.sortWith (\( a, _ ) ( b, _ ) -> compare (condorcet a b) (condorcet b a))
        |> List.map
            (\( x, ys ) ->
                { x = x, ys = Array.map (\y -> ( y, floor (toFloat (y - globalMin) / scale) )) ys |> Array.toList }
            )


buildBarChart :
    { options : List ( String, a ), answers : List (List a), sortDesc : Bool }
    -> List { x : String, y : Int }
buildBarChart { options, answers, sortDesc } =
    List.concat
        [ options
            |> List.map (\( lbl, opt ) -> { x = lbl, y = countIf (List.member opt) answers })
            |> (if sortDesc then
                    List.sortBy
                        (\choice ->
                            if choice.x == "N/A" || choice.x == "None directly" then
                                -1

                            else
                                -choice.y
                        )

                else
                    identity
               )
        , let
            shownOptions =
                List.map Tuple.second options

            y =
                answers
                    |> countIf (List.any (\x -> not (List.member x shownOptions)))
          in
          if y > 0 then
            [ { x = "Other", y = y } ]

          else
            []
        ]


displayPercent : Int -> Int -> String
displayPercent n =
    (\x -> 1000 * toFloat x / toFloat n)
        >> truncate
        >> (\x -> String.fromInt (x // 10) ++ "." ++ String.fromInt (x - 10 * (x // 10)) ++ "%")


total : List (List a) -> Int
total =
    totalWith List.length


totalWith : (a -> Int) -> List a -> Int
totalWith length =
    List.foldr
        (\xs acc ->
            acc
                + (if length xs > 0 then
                    1

                   else
                    0
                  )
        )
        0


countIf : (a -> Bool) -> List a -> Int
countIf predicate =
    List.foldr
        (\a n ->
            if predicate a then
                n + 1

            else
                n
        )
        0
