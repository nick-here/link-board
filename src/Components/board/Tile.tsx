import { MDBCollapse } from 'mdb-react-ui-kit';
import React, { useState, useEffect, useRef } from 'react';
import { useUpdateEffect } from '../../hooks';
import { EditableLabel } from '../EditableLabel';

/**
 * Editable tile containing its title, link and preview
 * @param {object} props
 * @param {string} props.title - tile's title
 * @param {string} props.link - tile's path
 * @param {string} props.icon - tile's background as a Font Awesome icon name
 * @param {any} [props.mouseEvent] - mouse down event to detect if user clicked outside of tile
 * @param {any} props.addTileBtn - only exception to clicking outside so the tile stays in edit mode after added
 * @param {function} props.setTileData - callback to update changed properties in parent element
 * @param {function} props.deleteTileData - callback to delete the tile from tiles list
 */
export function Tile({ title, link, icon, mouseEvent, addTileBtn, setTileData, deleteTileData }) {
	const titleDefaultValue = 'New tile';
	const mobileBreakpoint = 768;

	const thisTile = useRef(null);
	const iconContainer = useRef(null);
	const iconBtn = useRef(null);

	// Edit mode on when title empty
	const [editMode, setEditMode] = useState(title.length === 0);
	const [showEditBtn, setShowEditBtn] = useState(false);
	const [showIconSelect, setShowIconSelect] = useState(false);

	// Label values
	const [titleValue, setTitleValue] = useState(title);
	const [linkValue, setLinkValue] = useState(link);

	// Update data after closing edit mode
	useUpdateEffect(() => {
		if (!editMode) {
			const data = {
				title: titleValue,
				link: linkValue,
			};

			// Use default title when empty
			if (!titleValue.length) {
				data.title = titleDefaultValue;
				setTitleValue(titleDefaultValue);
			}

			setTileData(data);

			setShowIconSelect(false);
		}
	}, [editMode]);

	useUpdateEffect(() => {
		const target = mouseEvent.target;
		if (target && editMode) {
			// Clicked outside of tile
			if (!thisTile.current.contains(target)) setEditMode(false);
			// Clicked inside the tile but outside of icon container
			else if (!iconContainer.current.contains(target) && !iconBtn.current.contains(target))
				setShowIconSelect(false);
		}
	}, [mouseEvent]);

	// Enter edit mode if mounted and labels not set
	useEffect(() => {
		if (!title.length) setEditMode(true);
	}, []);

	return (
		<a
			ref={thisTile}
			className="tile"
			href={link}
			target="_blank"
			onMouseEnter={() => setShowEditBtn(true)}
			onMouseLeave={() => setShowEditBtn(false)}
			onClick={e => {
				// disable link when in edit mode
				if (editMode) e.preventDefault();
			}}
		>
			{/* background */}
			<div className="tile__background">
				<i className={`fas fa-${icon}`}></i>
			</div>

			<div className="tile__mask">
				<div className={`tile__icon-select${editMode ? ' show' : ''}`}>
					{/* icon select button */}
					<button
						ref={iconBtn}
						onClick={() => setShowIconSelect(showIconSelect => !showIconSelect)}
						disabled={!editMode}
					>
						<i className="fas fa-ellipsis-v"></i>
					</button>

					{/* icon collapse */}
					<MDBCollapse show={showIconSelect}>
						<div ref={iconContainer} className="tile__icon-container">
							{['align-left', 'star', 'music', 'shopping-basket'].map(
								(iconName, index) => (
									<button
										key={index}
										onClick={() => {
											setTileData({ icon: iconName });
											setShowIconSelect(false);
										}}
									>
										<i className={`fas fa-${iconName}`}></i>
									</button>
								)
							)}
						</div>
					</MDBCollapse>
				</div>

				<div className="tile__btn-container">
					{/* Delete button */}
					<button
						className={`tile__btn${editMode ? ' show' : ''}`}
						disabled={!editMode}
						onClick={() => deleteTileData()}
					>
						<i className="fas fa-trash-alt"></i>
					</button>

					{/* Edit mode button */}
					<button
						className={`tile__btn${
							editMode || showEditBtn || window.innerWidth <= mobileBreakpoint
								? ' show'
								: ''
						}`}
						onClick={e => {
							e.preventDefault();
							e.stopPropagation();

							setEditMode(editMode => !editMode);
						}}
					>
						{editMode ? (
							<i className="fas fa-check"></i>
						) : (
							<i className="fas fa-pen"></i>
						)}
					</button>
				</div>

				{/* name preview */}
				<EditableLabel
					className="tile__title"
					focus
					value={titleValue}
					setValue={setTitleValue}
					editMode={editMode}
					setEditMode={setEditMode}
				/>

				{/* link path */}
				<EditableLabel
					className="tile__link"
					value={linkValue}
					setValue={setLinkValue}
					placeholder="No link specified"
					editMode={editMode}
					setEditMode={setEditMode}
				/>
			</div>
		</a>
	);
}