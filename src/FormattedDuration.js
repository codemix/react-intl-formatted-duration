// @flow
import * as React from "react";
import PropTypes from "prop-types";
import {
  type IntlShape,
  intlShape,
  FormattedNumber,
  injectIntl
} from "react-intl";
import { formatDurationToParts } from "./formatDuration";
import { type MessagePart } from "./formatMessageToParts";

type Props = {
  intl: IntlShape,
  format?: string,
  seconds: number,
  textComponent: React.ComponentType<any>,
  valueComponent?: React.ComponentType<any>,
  children?: ({ value: string, tokens: MessagePart[] }) => React.Node
};

const printParts = (tokens: MessagePart[]) =>
  tokens
    .map(token => token.value)
    .join("")
    .trim();

class FormattedDuration extends React.Component<Props> {
  render() {
    const { intl, children } = this.props;

    const {
      seconds,
      textComponent: Text = intl.textComponent,
      valueComponent: Value = Text
    } = this.props;

    const tokens = formatDurationToParts(intl, seconds, this.props);
    if (typeof children === "function") {
      return children({ value: printParts(tokens), tokens });
    }

    return (
      <Text>
        {tokens.map(({ type, value }, i) => {
          if (value.trim().length === 0) {
            return value;
          }

          switch (type) {
            case "unit":
            case "literal":
              return <Text key={i}>{value}</Text>;

            default:
              return <Value key={i}>{value}</Value>;
          }
        })}
      </Text>
    );
  }
}

/*
 * This is a hack, react-intl has an internal method "shouldIntlComponentUpdate".
 * FormattedNumber#shouldComponentUpdate does nothing but delegate to that method.
 * We need that method to check if we should update the component.
 *
 * To remove this hack, we should either:
 * - Ask react-intl to expose shouldIntlComponentUpdate and support it officially
 * - Reimplement it, which would have a big decently big impact on the bundle size (https://github.com/yahoo/react-intl/blob/master/src/utils.js)
 */
(FormattedDuration.prototype: $FlowIgnore).shouldComponentUpdate =
  FormattedNumber.prototype.shouldComponentUpdate;

FormattedDuration.contextTypes = { intl: intlShape };

FormattedDuration.propTypes = {
  intl: intlShape.isRequired,
  format: PropTypes.string,
  seconds: PropTypes.number.isRequired,
  textComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  valueComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.func
};

export default injectIntl(FormattedDuration);
