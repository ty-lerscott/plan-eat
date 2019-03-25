import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { suitify } from 'utils/string';

class CustomDropdown extends React.Component {
    state = {
        filter: '',
        selected: {
            id: '',
            text: 'Mouse Over Now'
        }
    }

    dropdown = React.createRef();

    renderList = () => {
        const { items } = this.props;

        const listItems = (listItems) => listItems.map((item, index) =>
            <li
                onClick={this.handleSelect}
                data-id={item.id}
                className={suitify({
                    parent: 'Dropdown List',
                    child: 'Item'
                })}
                key={`Dropdown--List-${index}`}>
                {item.text}
            </li>
        );

        const filterList = (items) => {
            const {filter} = this.state;

            if (this.isFilter()) {
                if (Array.isArray(items)) {
                    return items.filter(item => item.text.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
                }

                // console.warn(filter.toLowerCase());

                const filteredPerList = Object.keys(items).map(listName => {
                    const searched = items[listName].filter(item => item.text.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
                    return searched.length && {
                        [listName]: searched
                    };
                }).filter(Boolean).reduce((obj, subMenu) => ({
                    ...obj,
                    ...subMenu
                }), {});

                // console.warn('----', filteredPerList);

                return filteredPerList;
            }

            return items;
        }

        const _items = filterList(items);

        return !_items ? null : (Array.isArray(_items) ? listItems(_items) : Object.keys(_items).map((listName, index) =>
            <li
                className="SubList"
                key={`sublist-${index}`}>
                <p>{listName}</p>
                <ul>
                    {listItems(_items[listName])}
                </ul>
            </li>
        ));
    }

    handleSelect = (e) => {
        this.setState({
            selected: {
                id: e.target.attributes.getNamedItem('data-id').value,
                text: e.target.innerText
            }
        }, () => {
            this.dropdown.current.blur();
            this.setState({filter: this.state.selected.text})
        });
    }

    handleFilter = (e) => {
        this.setState({
            filter: e.target.value
        });
    }

    DropdownTextComponent = () => {
        return this.isFilter() ? 'input' : 'span';
    }

    isFilter = () => (/filter/.test(this.props.type));

	render() {
        const {
            filter
        } = this.state;

        const Component = this.DropdownTextComponent();

        return (
            <div
                tabIndex={0}
                ref={this.dropdown}
                className={suitify({
                    parent: 'Dropdown',
                    ...(this.isFilter() && {variant: 'Filter'})
                })}>
                <Component
                    onChange={this.handleFilter}
                    {...(this.isFilter() && {
                        placeholder: 'Filter',
                        value: filter
                    })}
                    className={suitify({
                        parent: 'Dropdown',
                        child: 'SelectedText'
                    })}>
                    {this.isFilter() ? null : this.state.selected.text}
                </Component>
                <div className="Dropdown-Wrapper">
                    <ul className={classNames(
                        suitify({
                            parent: 'Dropdown',
                            child: 'List'
                        })
                    )}>
                        {this.renderList()}
                    </ul>
                </div>
            </div>
        );
	}
}

CustomDropdown.defaultProps = {
    editable: true,
    onChange: () => {},
    items: []
}

CustomDropdown.propTypes = {
    open: PropTypes.bool,
    light: PropTypes.bool,
    items: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    onOpen: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    ariaLabel: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    helperText: PropTypes.string,
    itemToString: PropTypes.func,
    defaultText: PropTypes.string,
    type: PropTypes.oneOf(['default', 'inline', 'filter'])
}

export default CustomDropdown;

