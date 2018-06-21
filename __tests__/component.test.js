// @flow

import * as React from "react";
import { default as FormattedDuration, EXTENDED_FORMAT } from "../src";
import { mountWithIntl } from "enzyme-react-intl";

function Text(props) {
  return <x-text {...props} />;
}

function Value(props) {
  return <x-value {...props} />;
}

describe("Component", () => {
  it("generates a stable dom", () => {
    const component = mountWithIntl(
      <FormattedDuration
        seconds={61}
        format={EXTENDED_FORMAT}
        textComponent={Text}
        valueComponent={Value}
      />
    );

    expect(component.html()).toMatchSnapshot();
  });

  it("uses a renderprop when supplied", () => {
    const component = mountWithIntl(
      <FormattedDuration seconds={61} format={EXTENDED_FORMAT}>
        {({ value }) => <span>{value}</span>}
      </FormattedDuration>
    );

    expect(component.html()).toMatchSnapshot();
  });

  it("passes tokens to a renderprop and renders them", () => {
    const component = mountWithIntl(
      <FormattedDuration seconds={61}>
        {({ tokens }) => (
          <div>
            {tokens.map(({ type, value }, i) => {
              if (value.trim().length === 0) {
                return value;
              }

              switch (type) {
                case "unit":
                case "literal":
                  return <strong key={i}>{value}</strong>;

                default:
                  return <span key={i}>{value}</span>;
              }
            })}
          </div>
        )}
      </FormattedDuration>
    );

    expect(component.html()).toMatchSnapshot();
  });
});
