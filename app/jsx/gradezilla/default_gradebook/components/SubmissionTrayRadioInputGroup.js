/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import FormFieldGroup from 'instructure-ui/lib/components/FormFieldGroup';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import SubmissionTrayRadioInput from 'jsx/gradezilla/default_gradebook/components/SubmissionTrayRadioInput';
import { statusesTitleMap } from 'jsx/gradezilla/default_gradebook/constants/statuses';
import NumberHelper from 'jsx/shared/helpers/numberHelper';
import I18n from 'i18n!gradebook';

function checkedValue (submission) {
  if (submission.excused) {
    return 'excused';
  } else if (submission.missing) {
    return 'missing';
  } else if (submission.late) {
    return 'late';
  }

  return 'none';
}

function isNumeric (input) {
  return NumberHelper.validate(input);
}

export default class SubmissionTrayRadioInputGroup extends React.Component {
  handleNumberInputBlur = ({ target: { value } }) => {
    if (!isNumeric(value)) {
      return;
    }

    let secondsLateOverride = NumberHelper.parse(value) * 3600;
    if (this.props.latePolicy.lateSubmissionInterval === 'day') {
      secondsLateOverride *= 24;
    }

    this.props.updateSubmission({
      latePolicyStatus: 'late',
      secondsLateOverride: Math.trunc(secondsLateOverride)
    });
  }

  handleRadioInputChanged = ({ target: { value } }) => {
    const alreadyChecked = checkedValue(this.props.submission) === value;
    if (alreadyChecked || this.props.submissionUpdating) {
      return;
    }

    const data = value === 'excused' ? { excuse: true } : { latePolicyStatus: value };
    if (value === 'late') {
      data.secondsLateOverride = 0;
    }

    this.props.updateSubmission(data);
  }

  render () {
    const description = <ScreenReaderContent>{I18n.t('Submission status')}</ScreenReaderContent>;
    const radioOptions = ['none', 'late', 'missing', 'excused'].map(status =>
      <SubmissionTrayRadioInput
        key={status}
        checked={checkedValue(this.props.submission) === status}
        color={this.props.colors[status]}
        latePolicy={this.props.latePolicy}
        locale={this.props.locale}
        onChange={this.handleRadioInputChanged}
        onNumberInputBlur={this.handleNumberInputBlur}
        submission={this.props.submission}
        text={statusesTitleMap[status] || I18n.t('None')}
        value={status}
      />
    );

    return <FormFieldGroup description={description} rowSpacing="none">{radioOptions}</FormFieldGroup>;
  }
}

SubmissionTrayRadioInputGroup.propTypes = {
  colors: shape({
    late: string.isRequired,
    missing: string.isRequired,
    excused: string.isRequired
  }).isRequired,
  latePolicy: shape({
    lateSubmissionInterval: string.isRequired
  }).isRequired,
  locale: string.isRequired,
  submission: shape({
    excused: bool.isRequired,
    late: bool.isRequired,
    missing: bool.isRequired,
    secondsLate: number.isRequired
  }).isRequired,
  submissionUpdating: bool.isRequired,
  updateSubmission: func.isRequired
};