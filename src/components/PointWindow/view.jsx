import React, {Component, PropTypes} from "react";

const propTypes = {
    onSaveClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onSetOnMapClick: PropTypes.func,
    item: PropTypes.object.isRequired
};

const defaultProps = {
    onSaveClick: (data) => {
    },
    onDeleteClick: (data) => {
    }
};

class NewPointView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            compTitle: 'Добавить',
            title: '',
            code: '',
            active: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.setValue = this.setValue.bind(this);
        // this.setMapCoord = this.setMapCoord.bind(this);

    }

    componentWillReceiveProps(newProps) {
        this.setState((newProps.item)
            ? {
                compTitle: newProps.item.title,
                title: newProps.item.title,
                code: newProps.item.code,
                active: (newProps.item.active)
            }
            : {
                compTitle: 'Добавить',
                title: '',
                code: '',
                active: false

            }
        );
    }

    shouldComponentUpdate(newProps, newState) {
        return true;
    }

    handleSubmit(e){
        e.preventDefault();

        let title = this.state.title.trim();
        let code =  this.state.code.trim();
        let active = this.state.active === 'on' || this.state.active === true;
        let id = this.props.item.id;
        this.props.onSaveClick({title, code, active,id});
        this.props.onDeleteClick({title, code, active,id});
    }
    handleDeleteClick(e){
        // e.preventDefault();
        if(this.state && this.state.code && this.state.code.trim()){
            let title = this.state.title.trim();
            let code =  this.state.code.trim();
            let active = this.state.active === 'on' || this.state.active === true;
            let id = this.props.item.id;

            this.props.onDeleteClick({title, code, active,id});
        }
    }
    // setMapCoord(e){
    //     // e.preventDefault();
    //     if(this.state && this.state.code && this.state.code.trim()){
    //         let title = this.state.title.trim();
    //         let code =  this.state.code.trim();
    //         let active = this.state.active === 'on' || this.state.active === true;
    //         let id = this.props.item.id;
    //
    //         this.props.onDeleteClick({title, code, active,id});
    //     }
    // }

    setValue (event) {
        let object = {};
        let field = event.target.name;
        if(field === 'active'){
            object[field] = event.target.checked;
        } else {
            object[field] = event.target.value;
        }
        this.setState(object);
    }

    render() {

        const isChecked = this.state.active;
        return (
            <div>
                <div className='col-md-8'>
                    <h2>{this.state.compTitle}</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group '>
                            <input name='title' type='text' className='form-control'
                                   placeholder='Название маршрута'
                                   onChange={this.setValue}
                                   value={this.state.title}
                            />
                        </div>
                        <div className='form-group'>
                            <input name='code' type='text' className='form-control' placeholder='Код точки'
                                   readOnly=''
                                   onChange={this.setValue}
                                   value={this.state.code}
                            />

                        </div>
                        <div className="row">
                            <div className='form-group col-md-4'>
                                <input name='lat' type='text' className='form-control' placeholder='Широта'
                                       readOnly=''
                                       onChange={this.setValue}
                                       value={this.state.code}
                                />

                            </div>
                            <div className='form-group col-md-4'>
                                <input name='long' type='text' className='form-control' placeholder='Долгота'
                                       readOnly=''
                                       onChange={this.setValue}
                                       value={this.state.code}
                                />
                            </div>
                            <div className='form-group col-md-4'>
                                <button
                                    type="button"
                                    value="setCoordinates"
                                    className="btn btn-default"
                                    onClick={this.props.onSetOnMapClick}
                                >
                                    Поставить на карте (не реализовано)
                                </button>
                            </div>
                        </div>
                        <div className='checkbox left'>
                            <label>
                                <input type='checkbox' name='active'
                                       checked={isChecked}
                                       onClick={this.setValue}
                                />
                                Точка активна
                            </label>
                        </div>
                        <div className="raw">
                            <button
                                type="submit"
                                value="save" className="btn btn-default"
                                style={{
                                    float: 'left'
                                }}
                            >
                                Сохранить
                            </button>
                        </div>
                        <div className="left">

                        </div>
                        <div className="left">
                            <button
                                type="button"
                                value="delete" className="btn btn-default"
                                style={{
                                    float: 'right'
                                }}
                                onClick={this.handleDeleteClick}
                            >
                                Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

NewPointView.propTypes = propTypes;
NewPointView.defaultProps = defaultProps;

export default NewPointView;


