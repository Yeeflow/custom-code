import React from 'react';

export class CodeInApplication implements CodeInComp {
  description() {
    return 'Display a sample component';
  }

  requiredFields() {
    return ['amount'];
  }

  inputParameters():InputParameter[]{
    return [
      {
        id: "title",
        type: "string",
        desc: "Title of the card"
      }
    ];
  }

  render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
    return <Sample codeInContext={context} readonly={readonly}/>
  }
}

class Sample extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
        const initialAmount = props.codeInContext.getFieldValue('amount') || 0;
        this.state = {
          amount: initialAmount,
          editing: false
        };
    }

    handleEditClick = () => {
      this.setState({ editing: true });
    };

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      this.setState({ amount: value });
    };

    handleSave = () => {
      const parsed = parseFloat(this.state.amount as any);
      const newAmount = isNaN(parsed) ? 0 : parsed;
      this.props.codeInContext.setFieldValue('amount', newAmount);      
      this.setState({ editing: false });
    };

    handleCancel = () => {
      this.setState({ editing: false, amount: this.props.codeInContext.getFieldValue('amount') });
    };

    render() {
      const {codeInContext, readonly} = this.props;
      const { amount, editing } = this.state;
      return <div>
        <h2>{codeInContext.params["title"]}</h2>
        <div style={{ marginBottom: 8 }}>
          Amount: {
            editing && !readonly ? (
              <span>
                <input
                  type="number"
                  value={amount}
                  onChange={this.handleInputChange}
                  style={{ width: 100, marginRight: 8 }}
                />
                <button onClick={this.handleSave} style={{ marginRight: 4 }}>Save</button>
                <button onClick={this.handleCancel}>Cancel</button>
              </span>
            ) : (
              <span>
                {amount}
                {!readonly && (
                  <button onClick={this.handleEditClick} style={{ marginLeft: 8 }}>
                    Edit
                  </button>
                )}
              </span>
            )
          }
        </div>
      </div>
    }
}