import {
  Container,
  Response,
  QuestionCard,
  List,
  Question,
} from "./QuestionStyling";
import arrow from "../../../assets/images/icon-arrow.svg";
import {
  Information,
  MainParagraph,
  MainTitle,
} from "../features/FeaturesStyling";
import styles from "./Questions.module.css";
import { useState } from "react";
import QuestionMap from "./QuestionMap";
import array from "./data.json";

export default function Questions(item, i) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (id) => {
    setIsActive((prevState) => ({
      ...isActive,
      [id]: !prevState[id],
    }));
  };

  return (
    <Container id="faq">
      <MainTitle>{"Frequently Asked Questions 🧐"}</MainTitle>
      <MainParagraph>
        {
          "Its purpose is to provide helpful information to users and save time for both the user and the company by addressing common questions and concerns before they become more complex issues."
        }
      </MainParagraph>

      <QuestionCard>
        <Question>
          <div className={styles.questions}>
            {array.map((item, i) => {
              return (
                <QuestionMap
                  title={item.title}
                  answer={item.description}
                ></QuestionMap>
              );
            })}
          </div>
        </Question>

        {/* <List onClick={() => handleClick(i)}>
          <Response>
            <Question>
              {"What is the pricing for TimeTaker?"}

              <img
                className={
                  isActive[`${i}`] ? styles.iconArrowActive : styles.iconArrow
                }
                alt="arrow"
                onClick={() => handleClick(i)}
                src={arrow}
                alt="arrow"
                key={i}
              />
            </Question>
            {
              "TimeTaker is free for personal use, and we would like to keep it that way. We are working on paid features for teams. You can find more info and FAQs about pricing here."
            }
          </Response>
        </List>

        <List onClick={() => handleClick(i)}>
          <Response>
            <Question>
              {"What data does TimeTaker track?"}

              <img
                className={
                  isActive[`${i}`] ? styles.iconArrowActive : styles.iconArrow
                }
                alt="arrow"
                onClick={() => handleClick(i)}
                src={arrow}
                alt="arrow"
                key={i}
              />
            </Question>
            {
              "We respect privacy and never collect any sensitive data. Some interactions in the app are tracked anonymously. For instance, we save usage statistics and error reports to constantly fix bugs and improve our product"
            }
          </Response>
        </List>

        <List onClick={() => handleClick(i)}>
          <Response>
            <Question>
              {"How does TimeTaker handle my data?"}

              <img
                className={
                  isActive[`${i}`] ? styles.iconArrowActive : styles.iconArrow
                }
                alt="arrow"
                onClick={() => handleClick(i)}
                src={arrow}
                alt="arrow"
                key={i}
              />
            </Question>
            {
              "TimeTaker is a pure browser citizen which doesn't require any data from your device. Sensitive data is encrypted and stored locally."
            }
          </Response>
        </List>

        <List onClick={() => handleClick(i)}>
          <Response>
            <Question>
              {"Is TimeTaker available on every browser?"}

              <img
                className={
                  isActive[`${i}`] ? styles.iconArrowActive : styles.iconArrow
                }
                alt="arrow"
                onClick={() => handleClick(i)}
                src={arrow}
                alt="arrow"
                key={i}
              />
            </Question>
            {
              "We want to nail the app for Chrome first. Afterwards we will apply our learnings to the other clients."
            }
          </Response>
        </List> */}
      </QuestionCard>
    </Container>
  );
}
