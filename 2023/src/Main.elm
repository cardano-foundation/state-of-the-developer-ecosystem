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

import Array
import Browser
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Lazy
import List.Extra
import Markdown exposing (defaultOptions)
import Set
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

    -- How would you rate your sentiment towards functional programming?
    , question3 : Scale

    -- Do you work on Cardano as a hobby or professionally?
    , question4 : MultipleChoices

    -- Which language(s) are you fluent in?
    , question5 : MultipleChoices

    -- Which best describes your current profession?
    , question6 : MultipleChoices

    -- What is your main development environment?
    , question7 : MultipleChoices

    -- Which programming language(s) are you proficient in?
    , question8 : MultipleChoices

    -- How would you rate your technical understanding of Cardano?
    , question9 : Scale

    -- Are you a certified Plutus Pioneer?
    , question10 : YesNo

    -- What do you use (or plan to use) for writing Plutus script validators / smart contracts?
    , question11 : MultipleChoices

    -- What language(s) do you use (or plan to use) for writing off-chain code?
    , question12 : MultipleChoices

    -- How satisfied are you with the current state of the smart contract ecosystem?
    , question13 : Scale

    -- What is your most awaited feature when it comes to Cardano’s smart contracts?
    , question14 : Open

    -- Which libraries do you use in your projects?
    , question15 : MultipleChoices

    -- How satisfied are you with the current state of the Cardano libraries listed in the previous question?
    , question16 : Scale

    -- Which services do you use in your projects?
    , question17 : MultipleChoices

    -- How satisfied are you with the current state of the Cardano services listed in the previous question?
    , question18 : Scale

    -- Which hosted service(s)/platform(s) do you use in your projects?
    , question19 : MultipleChoices

    -- How satisfied are you with the current state of the Cardano hosted services/platforms listed in the previous question?
    , question20 : Scale

    -- Which command-line tool(s) do you use in your projects?
    , question21 : MultipleChoices

    -- How satisfied are you with the current state of the Cardano command-line tools listed in the previous question?
    , question22 : Scale

    -- How do you manage deployment to your infrastructure
    , question23 : MultipleChoices

    -- How would you rather consume software?
    , question24 : MultipleChoices

    -- What do you think is the greatest asset of Cardano’s developer ecosystem?
    , question25 : Open

    -- What do you think is the most painful point of Cardano's developer ecosystem?
    , question26 : Open

    -- Select any statement that applies to you․
    , question27 : MultipleChoices

    -- Where do you usually seek help on technical issues?
    , question28 : MultipleChoices

    -- Where/how do you look for technical details on Cardano?
    , question29 : MultipleChoices

    -- On average, how satisfied are you with the technical answers/details you find in documentation and within the community?
    , question30 : Scale
    }


type DisplayOption
    = DisplayRelative
    | DisplayTotal


type alias Filter a =
    { title : String
    , function : List (List a) -> List (List a)
    }


type alias Question a =
    { title : String
    , comment : String
    , answers : List (List a)
    , options : List ( String, a )
    , sortDesc : Bool
    , additionalFilters : List (Filter a)
    , selectedFilter : Int
    , footnote : Maybe (Int -> List (List a) -> String)
    }


type alias MultipleChoices =
    { title : String
    , comment : String
    , answers : List (List String)
    , options : List String
    , sortDesc : Bool
    , selectedFilter : Int
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
    , options : List String
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


updateQuestion27 :
    { selectedFilter : Int }
    -> Msg
updateQuestion27 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question27
            in
            { model | questions = { questions | question27 = { q | selectedFilter = selectedFilter } } }


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
                [ viewQuestionMenu questions.question1
                , viewQuestionMenu questions.question2
                , viewQuestionMenu questions.question3
                , viewQuestionMenu questions.question4
                , viewQuestionMenu questions.question5
                , viewQuestionMenu questions.question6
                , viewQuestionMenu questions.question7
                , viewQuestionMenu questions.question8
                , viewQuestionMenu questions.question9
                , viewQuestionMenu questions.question10
                , viewQuestionMenu questions.question11
                , viewQuestionMenu questions.question12
                , viewQuestionMenu questions.question13
                , viewQuestionMenu questions.question14
                , viewQuestionMenu questions.question15
                , viewQuestionMenu questions.question16
                , viewQuestionMenu questions.question17
                , viewQuestionMenu questions.question18
                , viewQuestionMenu questions.question19
                , viewQuestionMenu questions.question20
                , viewQuestionMenu questions.question21
                , viewQuestionMenu questions.question22
                , viewQuestionMenu questions.question23
                , viewQuestionMenu questions.question24
                , viewQuestionMenu questions.question25
                , viewQuestionMenu questions.question26
                , viewQuestionMenu questions.question27
                , viewQuestionMenu questions.question28
                , viewQuestionMenu questions.question29
                , viewQuestionMenu questions.question30
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
        , viewScale model questions.question3
        , viewMultipleChoices model questions.question4
        , viewMultipleChoices model questions.question5
        , viewMultipleChoices model questions.question6
        , viewMultipleChoices model questions.question7
        , viewMultipleChoices model questions.question8
        , viewScale model questions.question9
        , viewYesNo model questions.question10
        , viewMultipleChoices model questions.question11
        , viewMultipleChoices model questions.question12
        , viewScale model questions.question13
        , viewOpen questions.question14
        , viewMultipleChoices model questions.question15
        , viewScale model questions.question16
        , viewMultipleChoices model questions.question17
        , viewScale model questions.question18
        , viewMultipleChoices model questions.question19
        , viewScale model questions.question20
        , viewMultipleChoices model questions.question21
        , viewScale model questions.question22
        , viewMultipleChoices model questions.question23
        , viewMultipleChoices model questions.question24
        , viewOpen questions.question25
        , viewOpen questions.question26
        , viewMultipleChoices model questions.question27
        , viewMultipleChoices model questions.question28
        , viewMultipleChoices model questions.question29
        , viewScale model questions.question30
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
viewMultipleChoicesWith model toMsg { title, comment, options, answers, sortDesc, selectedFilter } additionalFilters =
    viewQuestion
        model
        toMsg
        { title = title
        , comment = comment
        , answers = answers
        , options = List.map (\x -> ( x, x )) options
        , sortDesc = sortDesc
        , selectedFilter = selectedFilter
        , additionalFilters = additionalFilters
        , footnote = Nothing
        }


viewYesNo :
    Model
    -> YesNo
    -> Html Msg
viewYesNo model q =
    viewYesNoWith model noUpdate q []


viewYesNoWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> YesNo
    -> List (Filter Bool)
    -> Html Msg
viewYesNoWith model toMsg { title, comment, answers, selectedFilter } additionalFilters =
    viewQuestion
        model
        toMsg
        { title = title
        , comment = comment
        , answers = answers
        , options =
            [ ( "Yes", True )
            , ( "No", False )
            ]
        , sortDesc = True
        , selectedFilter = selectedFilter
        , additionalFilters = additionalFilters
        , footnote = Nothing
        }


viewScale :
    Model
    -> Scale
    -> Html Msg
viewScale model q =
    viewScaleWith model noUpdate q []


viewScaleWith :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> Scale
    -> List (Filter Int)
    -> Html Msg
viewScaleWith model toMsg { title, comment, answers, minimum, maximum, selectedFilter } additionalFilters =
    viewQuestion
        model
        toMsg
        { title = title
        , comment = comment
        , answers = answers
        , options =
            List.concat
                [ [ ( "10 (" ++ maximum ++ ")", 10 ) ]
                , List.range 2 9 |> List.map (\n -> ( String.fromInt n, n )) |> List.reverse
                , [ ( "1 (" ++ minimum ++ ")", 1 ) ]
                ]
        , sortDesc = False
        , selectedFilter = selectedFilter
        , additionalFilters = additionalFilters
        , footnote =
            Just
                (\totalFilteredAnswers filteredAnswers ->
                    let
                        mean =
                            toFloat (List.sum (List.map List.sum filteredAnswers)) / toFloat totalFilteredAnswers
                    in
                    String.join " "
                        [ "Arithmetic mean = "
                        , (10 * mean) |> truncate |> (\x -> String.fromInt (x // 10) ++ "." ++ String.fromInt (x - 10 * (x // 10)))
                        ]
                )
        }


viewOpen :
    Open
    -> Html Msg
viewOpen =
    Html.Lazy.lazy <|
        \{ title, options, comment, answers, link } ->
            Html.article
                []
                [ viewQuestionTitle title
                , Html.span
                    [ Html.Attributes.class "see-all" ]
                    [ Html.text <| String.fromInt (total answers) ++ " answers "
                    , Html.a
                        [ Html.Attributes.href link
                        , Html.Attributes.target "_blank"
                        ]
                        [ Html.text "(see all)" ]
                    ]
                , Html.ul [] <|
                    List.map (\opt -> Html.li [] [ Html.text opt ]) options
                , Html.hr [] []
                , Markdown.toHtmlWith { defaultOptions | sanitize = False } [] comment
                ]


viewQuestion :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> Question a
    -> Html Msg
viewQuestion model toMsg =
    Html.Lazy.lazy <|
        \{ title, options, answers, comment, sortDesc, selectedFilter, additionalFilters, footnote } ->
            let
                filters =
                    Array.fromList (defaultFilter (total answers) :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault (defaultFilter <| total answers)
                        |> (\{ function } -> function answers)

                data =
                    buildChart
                        { options = options
                        , answers = filteredAnswers
                        , sortDesc = sortDesc
                        }
            in
            Html.article
                []
                [ viewQuestionTitle title
                , Html.aside
                    []
                    (Html.div
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
                                    [ Html.text <| String.fromInt (total answers) ++ " answers" ]
                                ]
                           )
                    )
                , Html.ul
                    [ Html.Attributes.class "bars" ]
                    (data
                        |> List.map
                            (\{ x, y } ->
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
                , Html.div
                    [ Html.Attributes.class "footnote" ]
                    [ Html.text <|
                        case footnote of
                            Just custom ->
                                custom (total filteredAnswers) filteredAnswers

                            Nothing ->
                                ""
                    ]
                , Markdown.toHtmlWith { defaultOptions | sanitize = False } [] comment
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
        , Html.text title
        ]


viewQuestionMenu : { r | title : String } -> Html a
viewQuestionMenu { title } =
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


buildChart :
    { options : List ( String, a ), answers : List (List a), sortDesc : Bool }
    -> List { x : String, y : Int }
buildChart { options, answers, sortDesc } =
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
    List.foldr
        (\xs acc ->
            acc
                + (if List.length xs > 0 then
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
