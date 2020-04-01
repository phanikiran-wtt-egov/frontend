import React from "react";
import MUIDataTable from "mui-datatables";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { getLocaleLabels, appendModulePrefix } from "egov-ui-framework/ui-utils/commons";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
// import "./index.css";

class Table extends React.Component {
  state = {
    data: [],
    columns: [],
    customSortOrder: "asc"
  };

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            "&:nth-child(2)": {
              color: "#2196F3"
              //fontSize: 14
            }
          }
        },
        MuiTableCell: {
          body: {
            fontSize: 14
          },
          head: {
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.8700000048)",
            fontWeight: 700
          }
        }
      }
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach(column => {
          // Handling the case where column name is an object with options
          column = typeof column === "object" ? get(column, "name") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  componentWillReceiveProps(nextProps) {
    const { data, columns } = nextProps;
    this.updateTable(data, columns);
  }

  componentDidMount() {
    const { data, columns } = this.props;
    this.updateTable(data, columns);
  }

  updateTable = (data, columns) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: fixedColumns
    });
  };

  onColumnSortChange = (columnName, i) => {
    let { customSortOrder, data } = this.state;
    const { customSortColumn } = this.props;
    const { column, sortingFn } = customSortColumn;
    if (columnName === column) {
      const updatedData = sortingFn(cloneDeep(data), "", customSortOrder);
      this.setState({
        data: updatedData.data,
        customSortOrder: updatedData.currentOrder
      });
    }
  };

  render() {
    const { data, columns } = this.state;
    const { options, title, customSortDate } = this.props;
    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={{
            ...options,
            onColumnSortChange: (columnName, order) =>
              this.onColumnSortChange(columnName, order)
          }}
        />
      </MuiThemeProvider>
    );
    debugger;
  }
}

Table.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  // title: PropTypes.string.isRequired,
  // options: PropTypes.object.isRequired
};

//export default Table;
const mapStateToProps = (state, ownprops) => {
  let data = "";
  const { localizationLabels } = state.app;
  const { jsonPath, callBack } = ownprops;
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) {
    data = get(preparedFinalObject, jsonPath);
    
  }
  return { data, localizationLabels };
}; 


/* export function mapStateToProps(state, ownprops) {
  return {
     preFinalObj :state.screenConfiguration.preparedFinalObject
  };
} */

export default connect(
  mapStateToProps,{})(Table);


