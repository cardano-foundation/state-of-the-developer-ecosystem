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
    { question1 : MultipleChoices
    , question2 : MultipleChoices
    , question3 : MultipleChoices
    , question4 : MultipleChoices
    , question5 : MultipleChoices
    , question6 : MultipleChoices
    , question7 : MultipleChoices
    , question8 : YesNo
    , question9 : MultipleChoices
    , question10 : Scale
    , question11 : Scale
    , question12 : MultipleChoices
    , question13 : Scale
    , question14 : MultipleChoices
    , question15 : Scale
    , question16 : MultipleChoices
    , question17 : Scale
    , question18 : MultipleChoices
    , question19 : Scale
    , question20 : MultipleChoices
    , question21 : MultipleChoices
    , question22 : MultipleChoices
    , question23 : Open
    , question24 : Open
    , question25 : MultipleChoices
    , question26 : Open
    , question27 : MultipleChoices
    , question28 : MultipleChoices
    , question29 : Scale
    , question30 : Scale
    , question31 : Open
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
                , viewQuestionMenu questions.question31
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
        , viewMultipleChoicesWith
            model
            updateQuestion1
            questions.question1
            [ { title = "Single language spoken"
              , function = List.filter (\xs -> List.length xs == 1)
              }
            ]
        , viewMultipleChoices model questions.question2
        , viewMultipleChoicesWith
            model
            updateQuestion3
            questions.question3
            [ allButStudents questions
            , profession questions "Software engineer"
            , profession questions "Trader"
            , profession questions "Project manager"
            , profession questions "Marketing / sales"
            , profession questions "Web developer"
            , profession questions "Educator"
            , profession questions "Product manager"
            , profession questions "Artist"
            , profession questions "Academic researcher"
            ]
        , viewMultipleChoices model questions.question4
        , viewMultipleChoices model questions.question5
        , viewMultipleChoicesWith
            model
            updateQuestion6
            questions.question6
            [ isProficientIn questions "Haskell"
            ]
        , viewMultipleChoicesWith
            model
            updateQuestion7
            questions.question7
            [ isPlutusPioneer questions
            , usingEditor questions "Visual Studio Code"
            , usingEditor questions "Visual Studio"
            , usingEditor questions "Vim / NeoVim"
            , usingEditor questions "IntelliJ"
            ]
        , viewYesNoWith
            model
            updateQuestion8
            questions.question8
            [ isProficientIn questions "Haskell"
            ]
        , viewMultipleChoices model questions.question9
        , viewScaleWith
            model
            updateQuestion10
            questions.question10
            [ isProficientIn questions "Haskell"
            , withYearsOfExperience questions "Less than 1 year"
            , withYearsOfExperience questions "Between 1 and 3 years"
            , withYearsOfExperience questions "Between 3 and 10 years"
            , withYearsOfExperience questions "Over 10 years"
            ]
        , viewScaleWith
            model
            updateQuestion11
            questions.question11
            [ isProficientIn questions "Haskell"
            , withYearsOfExperience questions "Less than 1 year"
            , withYearsOfExperience questions "Between 1 and 3 years"
            , withYearsOfExperience questions "Between 3 and 10 years"
            , withYearsOfExperience questions "Over 10 years"
            ]
        , viewMultipleChoicesWith
            model
            updateQuestion12
            questions.question12
            [ isProficientIn questions "JavaScript"
            , isProficientIn questions "Python"
            , isProficientIn questions "TypeScript"
            , isProficientIn questions "Java"
            , isProficientIn questions "Haskell"
            ]
        , viewScale model questions.question13
        , viewMultipleChoicesWith
            model
            updateQuestion14
            questions.question14
            [ isProficientIn questions "JavaScript"
            , isProficientIn questions "Python"
            , isProficientIn questions "TypeScript"
            , isProficientIn questions "Java"
            , isProficientIn questions "Haskell"
            ]
        , viewScale model questions.question15
        , viewMultipleChoices model questions.question16
        , viewScale model questions.question17
        , viewMultipleChoices model questions.question18
        , viewScale model questions.question19
        , viewMultipleChoices model questions.question20
        , viewMultipleChoices model questions.question21
        , viewMultipleChoicesWith
            model
            updateQuestion22
            questions.question22
            [ isFullTimePro questions
            ]
        , viewOpen questions.question23
        , viewOpen questions.question24
        , viewMultipleChoices model questions.question25
        , viewOpen questions.question26
        , viewMultipleChoicesWith
            model
            updateQuestion27
            questions.question27
            [ expertiseLevel questions Newbie
            , expertiseLevel questions Seasoned
            , expertiseLevel questions Expert
            ]
        , viewMultipleChoicesWith
            model
            updateQuestion28
            questions.question28
            [ expertiseLevel questions Newbie
            , expertiseLevel questions Seasoned
            , expertiseLevel questions Expert
            ]
        , viewScaleWith
            model
            updateQuestion29
            questions.question29
            [ informationSource questions "Cardano Dev Portal"
            , informationSource questions "Cardano360"
            , informationSource questions "Blog articles"
            , informationSource questions "Twitter"
            , informationSource questions "Source Code"
            , informationSource questions "IOG Discord"
            , informationSource questions "Scientific Papers"
            ]
        , viewScaleWith
            model
            updateQuestion30
            questions.question30
            [ isPlutusPioneer questions
            , haveWrittenCIP questions
            , isProficientIn questions "Haskell"
            ]
        , viewOpen questions.question31
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


usingEditor : Questionnaire -> String -> Filter a
usingEditor questions editor =
    { title = "Using " ++ editor
    , function =
        \answers ->
            List.Extra.zip answers questions.question6.answers
                |> List.map
                    (\( a, editors ) ->
                        if List.member editor editors then
                            a

                        else
                            []
                    )
    }


isProficientIn : Questionnaire -> String -> Filter a
isProficientIn questions lang =
    { title = "Proficient in " ++ lang
    , function =
        \answers ->
            List.Extra.zip answers questions.question7.answers
                |> List.map
                    (\( a, langs ) ->
                        if List.member lang langs then
                            a

                        else
                            []
                    )
    }


allButStudents : Questionnaire -> Filter a
allButStudents questions =
    { title = "All but students"
    , function =
        \answers ->
            List.Extra.zip answers questions.question2.answers
                |> List.map
                    (\( a, jobs ) ->
                        if List.member "Student" jobs then
                            []

                        else
                            a
                    )
    }


profession : Questionnaire -> String -> Filter a
profession questions job =
    let
        pluralize s =
            case s of
                "Marketing / sales" ->
                    s

                _ ->
                    s ++ "s"
    in
    { title = pluralize job
    , function =
        \answers ->
            List.Extra.zip answers questions.question2.answers
                |> List.map
                    (\( a, jobs ) ->
                        if List.member job jobs then
                            a

                        else
                            []
                    )
    }


isPlutusPioneer : Questionnaire -> Filter a
isPlutusPioneer questions =
    { title = "Plutus pioneers"
    , function =
        \answers ->
            List.Extra.zip answers questions.question8.answers
                |> List.map
                    (\( a, pioneer ) ->
                        if List.member True pioneer then
                            a

                        else
                            []
                    )
    }


haveWrittenCIP : Questionnaire -> Filter a
haveWrittenCIP questions =
    { title = "Have (co-)written a CIP"
    , function =
        \answers ->
            List.Extra.zip answers questions.question25.answers
                |> List.map
                    (\( a, cips ) ->
                        if List.member "I have co-written a CIP" cips then
                            a

                        else
                            []
                    )
    }


isFullTimePro : Questionnaire -> Filter a
isFullTimePro questions =
    { title = "Working professionally on Cardano"
    , function =
        \answers ->
            List.Extra.zip answers questions.question3.answers
                |> List.map
                    (\( a, status ) ->
                        if List.member "Profession" status then
                            a

                        else
                            []
                    )
    }


withYearsOfExperience : Questionnaire -> String -> Filter a
withYearsOfExperience questions xp =
    { title = "With " ++ xp ++ " of experience writing software"
    , function =
        \answers ->
            List.Extra.zip answers questions.question4.answers
                |> List.map
                    (\( a, xps ) ->
                        if List.member xp xps then
                            a

                        else
                            []
                    )
    }


type Seniority
    = Newbie
    | Seasoned
    | Expert


expertiseLevel : Questionnaire -> Seniority -> Filter a
expertiseLevel questions seniority =
    let
        ( str, levels ) =
            case seniority of
                Newbie ->
                    ( "newbie", Set.fromList [ 1, 2, 3 ] )

                Seasoned ->
                    ( "seasoned", Set.fromList [ 4, 5, 6, 7 ] )

                Expert ->
                    ( "expert", Set.fromList [ 8, 9, 10 ] )
    in
    { title = "Cardano " ++ str
    , function =
        \answers ->
            List.Extra.zip answers questions.question30.answers
                |> List.map
                    (\( a, lvl ) ->
                        if Set.isEmpty (Set.intersect (Set.fromList lvl) levels) then
                            []

                        else
                            a
                    )
    }


informationSource : Questionnaire -> String -> Filter a
informationSource questions source =
    { title = "Reading/Watching " ++ source
    , function =
        \answers ->
            List.Extra.zip answers questions.question28.answers
                |> List.map
                    (\( a, sources ) ->
                        if List.member source sources then
                            a

                        else
                            []
                    )
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
                    List.sortBy (negate << .y)

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
