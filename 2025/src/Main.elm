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


maxColors : Int
maxColors =
    16


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

    -- Which best describes your current profession?"
    , question2 : MultipleChoices

    -- Which programming language(s) are you proficient in?
    , question3 : MultipleChoices

    -- How many years of experience do you have writing software using a functional programming stack?
    , question4 : MultipleChoices

    -- How many years of experience do you have writing/deploying software in the blockchain industry?
    , question5 : MultipleChoices

    -- Do you work on Cardano as a hobby or professionally?
    , question6 : MultipleChoices

    -- As a professional, what is your main source of revenue?
    , question7 : MultipleChoices

    -- Did you ever contribute, write, or deploy software in other blockchain ecosystems?
    , question8 : MultipleChoices

    -- Which other blockchain ecosystem(s) are you the most familiar with?
    , question9 : MultipleChoices

    -- What is your main development environment?
    , question10 : MultipleChoices

    -- How would you rate your technical understanding of Cardano?
    , question11 : Scale

    -- What should be the biggest priority on the Cardano technical roadmap?
    , question12 : Ranking

    -- What do you use (or plan to use) for writing Plutus script validators / smart contracts?
    , question13 : MultipleChoices

    -- What language(s) do you use (or plan to use) for writing off-chain code?
    , question14 : MultipleChoices

    -- How satisfied are you with the current state of the smart contract ecosystem?
    , question15 : Scale

    -- Which category of Cardano decentralized applications (DApps) are you currently working on or most interested in?
    , question16 : Ranking

    -- Which libraries do you use in your projects?
    , question17 : MultipleChoices

    -- It would be nice if a library in … implemented … ?
    , question18 : Open

    -- Which services do you use in your projects?
    , question19 : MultipleChoices

    -- It would be nice if a service provided … ?
    , question20 : Open

    -- Which hosted service(s)/platform(s) do you use in your projects?
    , question21 : MultipleChoices

    -- How do you prefer interacting with a local or remote service?
    , question22 : Ranking

    -- Which command-line tool(s) do you use in your projects?
    , question23 : MultipleChoices

    -- It would be nice if there were a CLI for … ?
    , question24 : Open

    -- Which type of infrastructure do you currently use or prefer for deploying DApps/blockchain applications?
    , question25 : MultipleChoices

    -- How would you prefer to consume software?
    , question26 : Ranking

    -- What do you think is the greatest asset of Cardano’s developer ecosystem?
    , question27 : Open

    -- "What do you think is the biggest pain point of Cardano's developer ecosystem?": [
    , question28 : Open

    -- Where do you usually seek help on technical issues?
    , question29 : MultipleChoices

    -- Where/how do you look for technical details on Cardano?
    , question30 : MultipleChoices

    -- On average, how satisfied are you with the technical answers/details you find in documentation and within the community?
    , question31 : Scale

    -- Select any statement that applies to you․
    , question32 : MultipleChoices

    -- Which language(s) do you prefer to consume documentation and educational content in?
    , question33 : MultipleChoices

    -- Did you attend the Cardano Buidler Fest in April 2024?
    , question34 : MultipleChoices

    -- How satisfied were you with the Cardano Buidler Fest?
    , question35 : Scale

    -- Do you have any ideas on how to improve the next potential Cardano Buidler Fest?
    , question36 : Open
    }


type DisplayOption
    = DisplayRelative
    | DisplayTotal


type alias Filter a =
    { title : String
    , function : List (List a) -> List (List a)
    }


type alias MultipleChoices =
    { title : String
    , comment : String
    , answers : List (List String)
    , options : List String
    , sortDesc : Bool
    , selectedFilter : Int
    }


type alias Ranking =
    { title : String
    , comment : String
    , answers : List (Array String)
    , options : List String
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
    , options : List ( String, Int, Maybe String )
    , answers : List (List String)
    }


init : Flags -> ( Model, Cmd Msg )
init { title, introduction, questions } =
    ( { title = title
      , introduction = introduction
      , questions =
            { questions
                | question1 =
                    let
                        question1 =
                            questions.question1
                    in
                    { question1 | sortDesc = False }
                , question4 =
                    let
                        question4 =
                            questions.question4
                    in
                    { question4 | sortDesc = False }
                , question5 =
                    let
                        question5 =
                            questions.question5
                    in
                    { question5 | sortDesc = False }
                , question6 =
                    let
                        question6 =
                            questions.question6
                    in
                    { question6 | sortDesc = False }
                , question8 =
                    let
                        question8 =
                            questions.question8
                    in
                    { question8 | sortDesc = False }
                , question32 =
                    let
                        question32 =
                            questions.question32
                    in
                    { question32 | sortDesc = False }
            }
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


updateQuestion17 :
    { selectedFilter : Int }
    -> Msg
updateQuestion17 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question17
            in
            { model | questions = { questions | question17 = { q | selectedFilter = selectedFilter } } }


updateQuestion19 :
    { selectedFilter : Int }
    -> Msg
updateQuestion19 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question19
            in
            { model | questions = { questions | question19 = { q | selectedFilter = selectedFilter } } }


updateQuestion21 :
    { selectedFilter : Int }
    -> Msg
updateQuestion21 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question21
            in
            { model | questions = { questions | question21 = { q | selectedFilter = selectedFilter } } }


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


updateQuestion23 :
    { selectedFilter : Int }
    -> Msg
updateQuestion23 { selectedFilter } =
    ChangeFilter <|
        \({ questions } as model) ->
            let
                q =
                    questions.question23
            in
            { model | questions = { questions | question23 = { q | selectedFilter = selectedFilter } } }


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
                , viewMenuLink questions.question36
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
        , questions.question1 |> viewBarChart model noUpdate []
        , questions.question2 |> viewBarChart model updateQuestion2 []
        , questions.question3
            |> viewDotsPlot model
                updateQuestion3
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                ]
        , questions.question4 |> viewBarChart model noUpdate []
        , questions.question5 |> viewBarChart model noUpdate []
        , questions.question6 |> viewBarChart model updateQuestion6 []
        , questions.question7 |> viewBarChart model noUpdate []
        , questions.question8 |> viewBarChart model updateQuestion8 []
        , questions.question9 |> viewDotsPlot model updateQuestion9 []
        , questions.question10 |> viewBarChart model updateQuestion10 []
        , questions.question11
            |> viewBoxPlot model
                updateQuestion11
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                , fromTechnicalSource questions "Discord servers"
                , fromTechnicalSource questions "Source code"
                , fromTechnicalSource questions "Blog or website articles & guides"
                , fromTechnicalSource questions "Cardano docs (https://docs.cardano.org/)"
                , fromTechnicalSource questions "Cardano's developer portal (https://developers.cardano.org/)"
                , fromTechnicalSource questions "Friends/colleagues/community members"
                , fromTechnicalSource questions "Scientific papers/specifications"
                , fromTechnicalSource questions "(Online) courses"
                , fromTechnicalSource questions "Cardano forum"
                , fromTechnicalSource questions "YouTube"
                , fromTechnicalSource questions "Telegram groups"
                , fromTechnicalSource questions "Twitter/X"
                ]
        , questions.question12
            |> viewStackBarChart model
                updateQuestion12
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                , withBlockchainExperience questions "Less than 1 year"
                , withBlockchainExperience questions "Between 1 and 2 years"
                , withBlockchainExperience questions "Between 2 and 7 years"
                , withBlockchainExperience questions "Over 7 years"
                , isHobbyist questions
                , isPro questions
                , onlyExperts questions
                ]
        , questions.question13
            |> viewDotsPlot model
                updateQuestion13
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                , isProficientIn questions "C"
                , isProficientIn questions "C#"
                , isProficientIn questions "C++"
                , isProficientIn questions "Go"
                , isProficientIn questions "Haskell"
                , isProficientIn questions "Java"
                , isProficientIn questions "PHP"
                , isProficientIn questions "Python"
                , isProficientIn questions "Rust"
                , isProficientIn questions "TypeScript"
                , isProficientIn questions "JavaScript"
                ]
        , questions.question14 |> viewDotsPlot model updateQuestion14 []
        , questions.question15
            |> viewBoxPlot model
                updateQuestion15
                [ usingOnChain questions "Aiken"
                , usingOnChain questions "Haskell/Plutus-Tx"
                , usingOnChain questions "Plu-ts"
                , usingOnChain questions "OpShin"
                , usingOnChain questions "Marlowe"
                , usingOnChain questions "Helios"
                , usingOnChain questions "Plutarch"
                , usingOnChain questions "Scalus"
                , usingOnChain questions "Solidity (with Milkomeda)"
                , usingOnChain questions "Purus"
                , usingOnChain questions "Pluto"
                ]
        , questions.question16
            |> viewStackBarChart model
                updateQuestion16
                [ withBlockchainExperience questions "Less than 1 year"
                , withBlockchainExperience questions "Between 1 and 2 years"
                , withBlockchainExperience questions "Between 2 and 7 years"
                , withBlockchainExperience questions "Over 7 years"
                , isHobbyist questions
                , isPro questions
                , onlyExperts questions
                , familiarWithOtherEcosystem questions
                ]
        , questions.question17
            |> viewDotsPlot model
                updateQuestion17
                [ isProficientIn questions "Aiken"
                , isProficientIn questions "C"
                , isProficientIn questions "C#"
                , isProficientIn questions "C++"
                , isProficientIn questions "Go"
                , isProficientIn questions "Haskell"
                , isProficientIn questions "Java"
                , isProficientIn questions "PHP"
                , isProficientIn questions "Python"
                , isProficientIn questions "Rust"
                , isProficientIn questions "TypeScript"
                , isProficientIn questions "JavaScript"
                , isInterestedIn questions "Decentralized Finance (DeFi)"
                , isInterestedIn questions "Identity and Authentication"
                , isInterestedIn questions "Real-World Asset Tokenization"
                , isInterestedIn questions "Governance"
                , isInterestedIn questions "NFT Marketplaces"
                , isInterestedIn questions "Supply Chain Management"
                , isInterestedIn questions "Social dApps"
                , isInterestedIn questions "Gaming and Metaverse"
                ]
        , questions.question18 |> viewOpen model
        , questions.question19
            |> viewDotsPlot model
                updateQuestion19
                [ isProficientIn questions "Aiken"
                , isProficientIn questions "C"
                , isProficientIn questions "C#"
                , isProficientIn questions "C++"
                , isProficientIn questions "Go"
                , isProficientIn questions "Haskell"
                , isProficientIn questions "Java"
                , isProficientIn questions "PHP"
                , isProficientIn questions "Python"
                , isProficientIn questions "Rust"
                , isProficientIn questions "TypeScript"
                , isProficientIn questions "JavaScript"
                , isInterestedIn questions "Decentralized Finance (DeFi)"
                , isInterestedIn questions "Identity and Authentication"
                , isInterestedIn questions "Real-World Asset Tokenization"
                , isInterestedIn questions "Governance"
                , isInterestedIn questions "NFT Marketplaces"
                , isInterestedIn questions "Supply Chain Management"
                , isInterestedIn questions "Social dApps"
                , isInterestedIn questions "Gaming and Metaverse"
                ]
        , questions.question20 |> viewOpen model
        , questions.question21
            |> viewDotsPlot model
                updateQuestion21
                [ isProficientIn questions "Aiken"
                , isProficientIn questions "C"
                , isProficientIn questions "C#"
                , isProficientIn questions "C++"
                , isProficientIn questions "Go"
                , isProficientIn questions "Haskell"
                , isProficientIn questions "Java"
                , isProficientIn questions "PHP"
                , isProficientIn questions "Python"
                , isProficientIn questions "Rust"
                , isProficientIn questions "TypeScript"
                , isProficientIn questions "JavaScript"
                , isInterestedIn questions "Decentralized Finance (DeFi)"
                , isInterestedIn questions "Identity and Authentication"
                , isInterestedIn questions "Real-World Asset Tokenization"
                , isInterestedIn questions "Governance"
                , isInterestedIn questions "NFT Marketplaces"
                , isInterestedIn questions "Supply Chain Management"
                , isInterestedIn questions "Social dApps"
                , isInterestedIn questions "Gaming and Metaverse"
                ]
        , questions.question22 |> viewStackBarChart model noUpdate []
        , questions.question23 |> viewDotsPlot model updateQuestion23 []
        , questions.question24 |> viewOpen model
        , questions.question25
            |> viewDotsPlot model
                noUpdate
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                ]
        , questions.question26
            |> viewStackBarChart model
                noUpdate
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                ]
        , questions.question27 |> viewOpen model
        , questions.question28 |> viewOpen model
        , questions.question29
            |> viewDotsPlot model
                updateQuestion29
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                , isPro questions
                , isHobbyist questions
                , onlyExperts questions
                ]
        , questions.question30
            |> viewDotsPlot model
                updateQuestion30
                [ withYearsOfExperience questions "Less than 1 year"
                , withYearsOfExperience questions "Between 1 and 2 years"
                , withYearsOfExperience questions "Between 2 and 7 years"
                , withYearsOfExperience questions "Over 7 years"
                , withBlockchainExperience questions "Less than 1 year"
                , withBlockchainExperience questions "Between 1 and 2 years"
                , withBlockchainExperience questions "Between 2 and 7 years"
                , withBlockchainExperience questions "Over 7 years"
                , isPro questions
                , isHobbyist questions
                , onlyExperts questions
                ]
        , questions.question31
            |> viewBoxPlot model
                updateQuestion31
                [ withBlockchainExperience questions "Less than 1 year"
                , withBlockchainExperience questions "Between 1 and 2 years"
                , withBlockchainExperience questions "Between 2 and 7 years"
                , withBlockchainExperience questions "Over 7 years"
                , fromTechnicalSource questions "Discord servers"
                , fromTechnicalSource questions "Source code"
                , fromTechnicalSource questions "Blog or website articles & guides"
                , fromTechnicalSource questions "Cardano docs (https://docs.cardano.org/)"
                , fromTechnicalSource questions "Cardano's developer portal (https://developers.cardano.org/)"
                , fromTechnicalSource questions "Friends/colleagues/community members"
                , fromTechnicalSource questions "Scientific papers/specifications"
                , fromTechnicalSource questions "(Online) courses"
                , fromTechnicalSource questions "Cardano forum"
                , fromTechnicalSource questions "YouTube"
                , fromTechnicalSource questions "Telegram groups"
                , fromTechnicalSource questions "Twitter/X"
                ]
        , questions.question32 |> viewDotsPlot model noUpdate []
        , questions.question33 |> viewDotsPlot model noUpdate []
        , questions.question34 |> viewBarChart model noUpdate []
        , questions.question35 |> viewBoxPlot model noUpdate []
        , questions.question36 |> viewOpen model
        ]


viewBarChart :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter String)
    -> MultipleChoices
    -> Html Msg
viewBarChart model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, options, answers, comment, sortDesc, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault defaultFilter
                        |> (\{ function } -> function answers)

                yMax =
                    total filteredAnswers

                data =
                    buildBarChart
                        { options = options
                        , answers = filteredAnswers
                        , sortDesc = sortDesc
                        }

                bars xs attrs =
                    Html.ul attrs
                        (List.map
                            (\{ x, y } ->
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
                            xs
                        )
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (total filteredAnswers) Nothing
                , data
                    |> List.filter (\{ y } -> y > 0)
                    |> (\xs -> bars xs [ Html.Attributes.class "bars" ])
                , viewQuestionFooter comment
                ]


viewDotsPlot :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter String)
    -> MultipleChoices
    -> Html Msg
viewDotsPlot model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, comment, options, answers, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault defaultFilter
                        |> (\{ function } -> function answers)

                ( data, others, yMax ) =
                    buildDotsPlot { options = options, answers = filteredAnswers, title = title }

                selectY { y } =
                    y

                globalMin =
                    data |> List.minimumBy selectY |> Maybe.map selectY |> Maybe.withDefault 0

                globalMax =
                    data |> List.maximumBy selectY |> Maybe.map selectY |> Maybe.withDefault yMax

                scale =
                    (toFloat globalMax - toFloat globalMin) / (toFloat maxColors - 1)
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (total filteredAnswers) (Just yMax)
                , Html.div [ Html.Attributes.class "stack-legend" ] []
                , (data
                    ++ (if others.y > 0 then
                            [ others ]

                        else
                            []
                       )
                  )
                    |> List.indexedMap
                        (\i choice ->
                            let
                                rank =
                                    floor (toFloat (choice.y - globalMin) / scale)

                                dots =
                                    List.repeat choice.y (Html.div [ Html.Attributes.class "dot" ] [])
                            in
                            Html.li
                                (Html.Attributes.class "dot-group"
                                    :: (if i == List.length data then
                                            []

                                        else
                                            [ Html.Attributes.attribute "data-rank" (String.fromInt rank) ]
                                       )
                                )
                                [ Html.label [] [ Html.text choice.x ]
                                , Html.div []
                                    [ Html.div [] dots
                                    , Html.div [ Html.Attributes.class "dot-labels" ] <|
                                        case model.displayOption of
                                            DisplayTotal ->
                                                [ Html.label [] [ Html.text <| String.fromInt choice.y ] ]

                                            DisplayRelative ->
                                                [ Html.label []
                                                    [ Html.text <|
                                                        displayPercent (total filteredAnswers) choice.y
                                                            ++ " (of respondents)"
                                                    ]
                                                , Html.label
                                                    []
                                                    [ Html.text <|
                                                        displayPercent yMax choice.y
                                                            ++ " (of all answers)"
                                                    ]
                                                ]
                                    ]
                                ]
                        )
                    |> Html.ul [ Html.Attributes.class "dots" ]
                , viewQuestionFooter comment
                ]


viewBoxPlot :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter Int)
    -> Scale
    -> Html Msg
viewBoxPlot model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, answers, comment, minimum, maximum, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault defaultFilter
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
                        |> Array.get (floor (toFloat len / 4))
                        |> Maybe.withDefault 0

                q3 =
                    filteredAnswers
                        |> Array.get (floor (3 * toFloat len / 4))
                        |> Maybe.withDefault 10

                position n =
                    String.fromInt (n * 10) ++ "%"
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (Array.length filteredAnswers) Nothing
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
                , Markdown.toHtmlWith { defaultOptions | sanitize = False }
                    [ Html.Attributes.class "comment" ]
                    comment
                ]


viewStackBarChart :
    Model
    -> ({ selectedFilter : Int } -> Msg)
    -> List (Filter String)
    -> Ranking
    -> Html Msg
viewStackBarChart model toMsg additionalFilters =
    Html.Lazy.lazy <|
        \{ title, options, answers, comment, selectedFilter } ->
            let
                filters =
                    Array.fromList (defaultFilter :: additionalFilters)

                filteredAnswers =
                    filters
                        |> Array.get selectedFilter
                        |> Maybe.withDefault defaultFilter
                        |> (\{ function } -> answers |> List.map Array.toList |> function)
                        |> List.map Array.fromList

                data =
                    buildStackBarChart
                        { options = options
                        , answers = filteredAnswers
                        }

                yMax =
                    data
                        |> List.map (\{ ys } -> List.foldl (\( y, _ ) sum -> sum + y) 0 ys)
                        |> List.maximum
                        |> Maybe.withDefault 0
            in
            Html.article
                []
                [ viewQuestionTitle title
                , viewQuestionControls toMsg model.displayOption filters (totalWith Array.length filteredAnswers) Nothing
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
                                Html.li
                                    []
                                    [ Html.label [] [ Html.text x ]
                                    , Html.div []
                                        (ys
                                            |> List.indexedMap
                                                (\i ( y, palette ) ->
                                                    if y == 0 then
                                                        []

                                                    else
                                                        [ Html.div
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
                                                        ]
                                                )
                                            |> List.concat
                                        )
                                    ]
                            )
                    )
                , Markdown.toHtmlWith { defaultOptions | sanitize = False }
                    [ Html.Attributes.class "comment" ]
                    comment
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
    -> Maybe Int
    -> Html Msg
viewQuestionControls toMsg displayOption filters totalRespondents whenTotalAnswers =
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
                    , Html.text (String.fromInt totalRespondents ++ " respondents")
                    ]
                        ++ (case whenTotalAnswers of
                                Nothing ->
                                    []

                                Just totalAnswers ->
                                    [ Html.text (" / " ++ String.fromInt totalAnswers ++ " answers") ]
                           )

                else
                    [ Html.span
                        [ Html.Attributes.class "filters" ]
                        (Html.text (String.fromInt totalRespondents ++ " respondents")
                            :: (case whenTotalAnswers of
                                    Nothing ->
                                        []

                                    Just totalAnswers ->
                                        [ Html.text (" / " ++ String.fromInt totalAnswers ++ " answers") ]
                               )
                        )
                    ]
               )
        )


viewQuestionFooter : String -> Html Msg
viewQuestionFooter =
    Markdown.toHtmlWith { defaultOptions | sanitize = False }
        [ Html.Attributes.class "comment" ]


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


defaultFilter : Filter a
defaultFilter =
    { title = "All respondents"
    , function = identity
    }


withYearsOfExperience : Questionnaire -> String -> Filter a
withYearsOfExperience questions xp =
    { title = "With " ++ xp ++ " of experience"
    , function =
        \answers ->
            List.zip answers questions.question1.answers
                |> List.map
                    (\( a, xps ) ->
                        if List.member xp xps then
                            a

                        else
                            []
                    )
    }


withBlockchainExperience : Questionnaire -> String -> Filter a
withBlockchainExperience questions xp =
    { title = "Writing blockchain software for " ++ xp
    , function =
        \answers ->
            List.zip answers questions.question5.answers
                |> List.map
                    (\( a, xps ) ->
                        if List.member xp xps then
                            a

                        else
                            []
                    )
    }


fromTechnicalSource : Questionnaire -> String -> Filter a
fromTechnicalSource questions source =
    { title = "Learning from " ++ source
    , function =
        \answers ->
            List.zip answers questions.question30.answers
                |> List.map
                    (\( a, sources ) ->
                        if List.member source sources then
                            a

                        else
                            []
                    )
    }


isPro : Questionnaire -> Filter a
isPro questions =
    { title = "Only professionals"
    , function =
        \answers ->
            List.zip answers questions.question6.answers
                |> List.map
                    (\( a, statuses ) ->
                        if statuses /= [ "Hobby" ] then
                            a

                        else
                            []
                    )
    }


onlyExperts : Questionnaire -> Filter a
onlyExperts questions =
    { title = "Only Cardano experts (> 7)"
    , function =
        \answers ->
            List.zip answers questions.question11.answers
                |> List.map
                    (\( x, y ) ->
                        if Maybe.withDefault 0 (List.head y) > 7 then
                            x

                        else
                            []
                    )
    }


familiarWithOtherEcosystem : Questionnaire -> Filter a
familiarWithOtherEcosystem questions =
    { title = "Familiar with other ecosystems"
    , function =
        \answers ->
            List.zip answers questions.question9.answers
                |> List.map
                    (\( x, y ) ->
                        if y == [ "I have only ever worked in the Cardano ecosystem" ] || y == [ "" ] then
                            x

                        else
                            []
                    )
    }


isHobbyist : Questionnaire -> Filter a
isHobbyist questions =
    { title = "Only hobbyist"
    , function =
        \answers ->
            List.zip answers questions.question6.answers
                |> List.map
                    (\( a, statuses ) ->
                        if statuses == [ "Hobby" ] then
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
            List.zip answers questions.question3.answers
                |> List.map
                    (\( a, langs ) ->
                        if List.member lang langs then
                            a

                        else
                            []
                    )
    }


isInterestedIn : Questionnaire -> String -> Filter a
isInterestedIn questions lang =
    { title = "Interested in " ++ lang
    , function =
        \answers ->
            List.zip answers (List.map Array.toList questions.question16.answers)
                |> List.map
                    (\( a, langs ) ->
                        if List.member lang langs then
                            a

                        else
                            []
                    )
    }


usingOnChain : Questionnaire -> String -> Filter a
usingOnChain questions lang =
    { title = "Using " ++ lang ++ " on-chain"
    , function =
        \answers ->
            List.zip answers questions.question13.answers
                |> List.map
                    (\( a, langs ) ->
                        if List.member lang langs then
                            a

                        else
                            []
                    )
    }


experiencedWithCardano : Questionnaire -> Filter a
experiencedWithCardano questions =
    { title = "Experienced only with Cardano"
    , function =
        \answers ->
            List.zip answers questions.question8.answers
                |> List.map
                    (\( x, y ) ->
                        if y == [ "I have only ever worked in the Cardano ecosystem" ] then
                            x

                        else
                            []
                    )
    }


experiencedWithOther : Questionnaire -> Filter a
experiencedWithOther questions =
    { title = "Experienced with other ecosystems"
    , function =
        \answers ->
            List.zip answers questions.question8.answers
                |> List.map
                    (\( x, y ) ->
                        if y /= [ "I have only ever worked in the Cardano ecosystem" ] then
                            x

                        else
                            []
                    )
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
                len + 1

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
            (toFloat globalMax - toFloat globalMin) / (toFloat maxColors - 1)
    in
    stack
        |> Dict.toList
        |> List.sortWith (\( a, _ ) ( b, _ ) -> compare (condorcet a b) (condorcet b a))
        |> List.map
            (\( x, ys ) ->
                { x = x, ys = Array.map (\y -> ( y, floor (toFloat (y - globalMin) / scale) )) ys |> Array.toList }
            )


buildDotsPlot :
    { options : List String, answers : List (List String), title : String }
    -> ( List { x : String, y : Int }, { x : String, y : Int }, Int )
buildDotsPlot { options, answers, title } =
    let
        countOne value =
            case value of
                Nothing ->
                    Just 1

                Just n ->
                    Just (n + 1)

        ( countedAnswers, countedOthers ) =
            answers
                |> List.foldr
                    (\opts ( dict0, others0 ) ->
                        List.foldr
                            (\opt ( dict, others ) ->
                                if opt == "None" || List.member opt options then
                                    ( dict |> Dict.update opt countOne, others )

                                else
                                    ( dict, Debug.log (title ++ " " ++ opt) (others + 1) )
                            )
                            ( dict0, others0 )
                            opts
                    )
                    ( Dict.empty, 0 )

        count =
            List.foldr (\{ y } n -> y + n) 0

        sortedAnswers =
            countedAnswers
                |> Dict.toList
                |> List.map (\( x, y ) -> { x = x, y = y })
                |> List.sortBy
                    (\choice ->
                        if choice.x == "None" then
                            List.length answers + 1

                        else
                            -choice.y
                    )
    in
    ( sortedAnswers
    , { x = "Other", y = countedOthers }
    , countedOthers + count sortedAnswers
    )


buildBarChart :
    { options : List String, answers : List (List String), sortDesc : Bool }
    -> List { x : String, y : Int }
buildBarChart { options, answers, sortDesc } =
    List.concat
        [ options
            |> List.map (\opt -> { x = opt, y = countIf (List.member opt) answers })
            |> (if sortDesc then
                    List.sortBy
                        (\choice ->
                            if choice.x == "None directly" then
                                -1

                            else
                                -choice.y
                        )

                else
                    identity
               )
        , let
            y =
                answers
                    |> countIf (List.any (\x -> not (List.member x options)))
          in
          if y > 0 then
            [ { x = "Other", y = y } ]

          else
            []
        ]


displayPercent : Int -> Int -> String
displayPercent nMax n =
    displayPercentRaw nMax n ++ "%"


displayPercentRaw : Int -> Int -> String
displayPercentRaw n =
    (\x -> 1000 * toFloat x / toFloat n)
        >> truncate
        >> (\x -> String.fromInt (x // 10) ++ "." ++ String.fromInt (x - 10 * (x // 10)))


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
