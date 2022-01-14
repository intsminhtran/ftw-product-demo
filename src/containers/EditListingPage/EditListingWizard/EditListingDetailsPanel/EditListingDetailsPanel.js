import React from 'react';
import {bool, func, object, oneOf, shape, string} from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import {FormattedMessage} from '../../../../util/reactIntl';
import {ensureOwnListing} from '../../../../util/data';
import {LISTING_STATE_DRAFT} from '../../../../util/types';

// Import shared components
import {ListingLink} from '../../../../components';

// Import modules from this directory
import EditListingDetailsForm from './EditListingDetailsForm';
import css from './EditListingDetailsPanel.module.css';
import {DEFAULT_SELLER_STATUS, LISTING_PAGE_PARAM_TYPES} from "../../../../util/urlHelpers";
import {SUPPORTED_TABS} from "../EditListingWizardTab";

const EditListingDetailsPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    params,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const {description, title, publicData} = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDetailsPanel.title"
      values={{listingTitle: <ListingLink listing={listing}/>}}
    />
  ) : (
    <FormattedMessage id="EditListingDetailsPanel.createListingTitle"/>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDetailsForm
        className={css.form}
        initialValues={{
          title,
          description,
          category: publicData.category,
          size: publicData.size,
          brand: publicData.brand,
          status: publicData.status || DEFAULT_SELLER_STATUS,
          salePlace: publicData.salePlace,
        }}
        params={params}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const {title, description, category, size, brand, status, salePlace} = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {category, size, brand, status, salePlace},
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        autoFocus
      />
    </div>
  );
};

EditListingDetailsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDetailsPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  params: shape({
    type: oneOf(LISTING_PAGE_PARAM_TYPES),
  }),

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDetailsPanel;
