import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    getBreak,
    getDateField,
    getTimeField,
    getSelectField,
    getTextField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { gotoApplyWithStep } from "../../utils/index";
  import { getTransformedLocale, getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import get from "lodash/get";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  
  const getHeader = label => {
    return {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-bpa",
      componentPath: "DividerWithLabel",
      props: {
        className: "hr-generic-divider-label",
        labelProps: {},
        dividerProps: {},
        label
      },
      type: "array"
    };
  };
  
  const fieldInspectionMultiItem = () => {
    return getCommonContainer({
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
            style: { marginBottom: "10px" }
          },
          children: {
            header: {
              gridDefination: {
                xs: 8
              },
              ...getCommonSubHeader({
                labelName: "Field Inspection",
                labelKey: "BPA_FIELD_INSPECTION_DETAILS_TITLE"
              })
            },
            editSection: {
              componentPath: "Button",
              props: {
                color: "primary",
                style: {
                  marginTop: "-10px",
                  marginRight: "-18px"
                }
              },
              gridDefination: {
                xs: 4,
                align: "right"
              }
            }
          }
        },
        fieldSummaryHeader: getCommonContainer({
          applicationdate : getDateField({
            label: {
              labelName: "Inspection Date",
              labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
            },
            props: {
              className : "tl-trade-type"
            },
            jsonPath : "BPA.additionalDetails.fieldinspection_pending[0].date",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          }),
          applicationtime : getTimeField({
            label: {
              labelName: "Inspection Time",
              labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
            },  
            props: {
              className : "tl-trade-type"
            },
            jsonPath : "BPA.additionalDetails.fieldinspection_pending[0].time",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        }),
        bpaCheckListContainer: getHeader({
          labelName: "Check List",
          labelKey: "BPA_CHECK_LIST_DETAILS"
        }),
        break1: getBreak(),
        questions:{
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
              className: "filed-inspection",
              scheama: getCommonContainer({
                  questionLabel: {
                    uiFramework: "custom-containers",
                    componentPath: "LabelContainer",
                    props : {
                      jsonPath : "FieldinspectionQstns[0].code"
                    },
                    gridDefination: {
                      xs: 12,
                      sm: 12,
                      md: 6
                    }
                  },
                  selectField : {
                    ...getSelectField({
                      label: {
                        labelName: "Answer",
                        labelKey: "Answer"
                      },
                      placeholder: {
                        labelName: "Select answer",
                        labelKey: "Select Answer"
                      },
                      jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].questions[0].value",
                      props: {
                        jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending[0].questions"
                      },
                      sourceJsonPath: "FieldinspectionQstns[0].cards[0].dropDownValues.menu",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12,
                        md: 3
                      }
                    }),
                    beforeFieldChange: (action, state, dispatch) => {
                    let compObj = get(state,"screenConfiguration.screenConfig."+action.screenKey+'.'+action.componentJsonpath);
                      let questionJsonPath = compObj.jsonPath.replace("value","question");
                      let questionLabelPath = "FieldinspectionQstns["+compObj.index+"].code";
                      let questoinLabel = get(state,"screenConfiguration.preparedFinalObject."+questionLabelPath,""); 
                    
                      dispatch(prepareFinalObject(questionJsonPath, questoinLabel));
                    }
                  },
                  remarksFields :  getTextField({
                    label: {
                      labelName: "Remarks",
                      labelKey: "Enter remarks"
                    },
                    jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].questions[0].remarks",
                    gridDefination: {
                      xs: 12,
                      sm: 12,
                      md: 3
                    },
                    props: {
                      disabled: false,
                      className : "tl-trade-type",
                      jsonPathUpdatePrefix : "BPA.additionalDetails.fieldinspection_pending[0].questions"
                    }
                  })
              }),
              items: [],
              hasAddItem: false,
              isReviewPage: true,
              sourceJsonPath: "FieldinspectionQstns",
              prefixSourceJsonPath: "children",
              jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
              jsonPath : "BPA.additionalDetails.fieldinspection_pending[0].questions"
          },
          type: "array"
        },
        BlockWiseOccupancyAndUsageDetails: getHeader({
          labelName: "Documents",
          labelKey: "BPA_FIELD_INSPECTION_DOCUMENTS"
        }),
        break2: getBreak(),
        documentList: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-bpa",
            componentPath: "NocListContainer",
            props: {
              documents: [],
              jsonPath : "BPA.additionalDetails.fieldinspection_pending[0].docs",
			        jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
              buttonLabel: {
                labelName: "UPLOAD FILE",
                labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
              },
              inputProps: {
                accept: "image/*, .pdf, .png, .jpeg",
                multiple: false            
              },
              maxFileSize: 6000
            },
            type: "array"
        }
      })
   };

  export const fieldinspectionSummary = getCommonGrayCard({
      summaryContent : {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "filed-inspection-summary",
            scheama: fieldInspectionMultiItem(),
            items: [],
            hasAddItem: true,
            isReviewPage: false,
            addItemLabel:{
              labelName:"Add Another Field Inspection Report",
              labelKey:""
            },
            prefixSourceJsonPath: "children",
            sourceJsonPath : "BPA.additionalDetails.fieldinspection_pending"
            //here sourceJsonPath is not required as MultiItem default behaviour it will display item for one time
            // and the same we are adding each time clicking on + icon.
        },
        type: "array"
      }
    });
  
