import axios from "axios";
import { SLACK_WEBHOOK } from "../config";

export class Notifications {
  public slackMessageTest = async ({ data, at, name, pmId }): Promise<void> => {
    try {
      const res = await axios.post(SLACK_WEBHOOK, {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Event",
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: "*Type:*\nError",
              },
              {
                type: "mrkdwn",
                text: `*PM ID:*\n${pmId}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*When:*\n${at}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Data:*\n${data}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<http://localhost:5173/${pmId}>`,
            },
          },
        ],
      });
    } catch (error) {}
  };
}
