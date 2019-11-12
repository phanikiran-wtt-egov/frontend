import React, { Component } from "react";
import { Button } from "components";
import { Dialog } from "components";
import RadioButtonForm from "./components/RadioButtonForm";
import Label from "egov-ui-kit/utils/translationNode";
import formHoc from "egov-ui-kit/hocs/form";
import { resetFormWizard } from "egov-ui-kit/utils/PTCommon";
import { connect } from "react-redux";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import commonConfig from "config/common.js";
import get from "lodash/get"
import { prepareFormData,fetchGeneralMDMSData,toggleSpinner,loadMDMSData } from "egov-ui-kit/redux/common/actions";


import "./index.css";

const YearDialogueHOC = formHoc({
  formKey: "financialYear",
  path: "PropertyTaxPay",
  isCoreConfiguration: true
})(RadioButtonForm);

class YearDialog extends Component {
  state = {
    selectedYear: ''
  }
  handleRadioButton = (e) => {
    this.setState({
      selectedYear: e.target.value
    })
  }
  componentDidMount = () => {
    const { loadMDMSData,toggleSpinner } = this.props;
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "egf-master",
            masterDetails: [
              {
                name: "FinancialYear",
                filter: "[?(@.module == 'PT')]"
              }
            ]
          },
           {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "RoadType"
              },
              {
                name: "ConstructionType"
              },
              {
                name:"Thana"
              },
            ]
          }
        ]
      }
    };
    toggleSpinner();
    loadMDMSData(requestBody);
    toggleSpinner();
  };

  resetForm = () => {
    const {
      form,
      removeForm,
      prepareFormData
    } = this.props;
    resetFormWizard(form, removeForm);
    prepareFormData("Properties", []);
  };

  render() {
    let { open, closeDialogue, getYearList, history, urlToAppend } = this.props;
    return getYearList ? (
      <Dialog
        open={open}
        children={[
          <div key={1}>
            <div className="dialogue-question">
              <Label
                label="PT_FINANCIAL_YEAR_PLACEHOLDER"
                fontSize="20px"
                color="black"
              />
            </div>
            <div className="year-range-botton-cont">
              {Object.values(getYearList).map((item, index) => (
                <YearDialogueHOC
                  handleRadioButton={this.handleRadioButton}
                  selectedYear={this.state.selectedYear}
                  key={index}
                  label={item}
                  history={history}
                  resetFormWizard={this.resetForm}
                  urlToAppend={urlToAppend}
                />
              ))}
            </div>
            <div className='year-dialogue-button'>
              <Button label='Cancel'
                onClick={() => { closeDialogue() }}
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }}></Button>
              <Button label='OK'
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }} onClick={() => {
                  if (this.state.selectedYear !== '') {
                    this.resetForm();
                    history && urlToAppend ? history.push(`${urlToAppend}&FY=${this.state.selectedYear}`) : history.push(`/property-tax/assessment-form?FY=${this.state.selectedYear}&type=new`);
                  }
                  else {
                    alert('Please Select a Financial Year!');
                  }
                }}></Button>
            </div>
          </div>
        ]}
        bodyStyle={{ backgroundColor: "#ffffff" }}
        isClose={false}
        onRequestClose={closeDialogue}
        contentClassName="year-dialog-content"
      // contentStyle={{ width: "20%" }}
      />
    ) : null;
  }
}

const mapStateToProps = state => {
  const { common, form } = state;
  const { loadMdmsData } = common;
  const FinancialYear = loadMdmsData && get(loadMdmsData , "egf-master.FinancialYear");
   const getYearList = FinancialYear && Object.keys(FinancialYear);
  return { getYearList, form };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) =>
      dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    removeForm: formkey => dispatch(removeForm(formkey)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    prepareFormData: (path, value) => dispatch(prepareFormData(path, value)),
    loadMDMSData: (requestBody, moduleName, masterName) =>
      dispatch(loadMDMSData(requestBody, moduleName, masterName)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDialog);
