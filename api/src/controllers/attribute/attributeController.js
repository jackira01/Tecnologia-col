import AttributeModel from '../../models/Attribute.cjs';

/**
 * Get attributes by category (returns the aggregated object)
 */
export const getAttributesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    let attributeDoc = await AttributeModel.findOne({ category });

    // If not found, return empty structure or create one on fly?
    // Let's return empty structure to be safe, or null. Frontend should handle it.
    if (!attributeDoc) {
      return res.status(200).json({ category, data: {} });
    }

    return res.status(200).json(attributeDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attributes by category' });
  }
};

/**
 * Add a value to a specific list within a category
 * Body: { category: 'processors', key: 'brands', value: 'Intel' }
 */
export const addValueToCategory = async (req, res) => {
  const { category, key, value } = req.body;

  if (!category || !key || !value) {
    return res.status(400).json({ message: 'Missing required fields: category, key, value' });
  }

  try {
    // Find doc or create if doesn't exist
    let attributeDoc = await AttributeModel.findOne({ category });

    if (!attributeDoc) {
      attributeDoc = new AttributeModel({ category, data: {} });
    }

    // Ensure the key exists in data map
    if (!attributeDoc.data.has(key)) {
      attributeDoc.data.set(key, []);
    }

    // Get the array
    const list = attributeDoc.data.get(key);

    // Check for duplicates
    if (list.includes(value)) {
      return res.status(409).json({ message: 'Value already exists in this list' });
    }

    // Add value and sort
    list.push(value);
    list.sort();

    // Update map
    attributeDoc.data.set(key, list);

    // Explicitly mark 'data' as modified to ensure Mongoose saves the change
    attributeDoc.markModified('data');

    await attributeDoc.save();

    res.status(200).json({
      message: 'Value added successfully',
      attribute: attributeDoc
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding value to category' });
  }
};

/**
 * Update a value in a specific list within a category
 * Body: { category: 'processors', key: 'brands', oldValue: 'Intel', newValue: 'Intey', newParent: optional }
 */
export const updateValueInCategory = async (req, res) => {
  const { category, key, oldValue, newValue, newParent } = req.body;

  try {
    const attributeDoc = await AttributeModel.findOne({ category });

    if (!attributeDoc || !attributeDoc.data.has(key)) {
      return res.status(404).json({ message: 'Category or list not found' });
    }

    const list = attributeDoc.data.get(key);

    // Find index
    const index = list.findIndex(item => {
      if (typeof item === 'string') return item === oldValue;
      return item.value === oldValue;
    });

    if (index === -1) {
      return res.status(404).json({ message: 'Value not found to update' });
    }

    // Prepare updated item
    let updatedItem = list[index];
    if (typeof updatedItem === 'string') {
      // If it was string, and we are updating to string
      if (!newParent) {
        updatedItem = newValue || oldValue;
      } else {
        // upgrading to object
        updatedItem = { value: newValue || oldValue, parent: newParent };
      }
    } else {
      // Was object
      updatedItem = { ...updatedItem, value: newValue || updatedItem.value };
      if (newParent !== undefined) updatedItem.parent = newParent;
    }

    list[index] = updatedItem;

    // Sort if possible (simple sort might break with mixed types)
    // list.sort(); 

    attributeDoc.data.set(key, list);
    // Mark modified because mixed types or deep changes might not be detected automatically
    attributeDoc.markModified('data');
    await attributeDoc.save();

    res.status(200).json({
      message: 'Value updated successfully',
      attribute: attributeDoc
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating value' });
  }
};

/**
 * Remove a value from a specific list within a category
 * Body: { category: 'processors', key: 'brands', value: 'Intel' }
 */
export const removeValueFromCategory = async (req, res) => {
  const { category, key, value } = req.body;

  try {
    const attributeDoc = await AttributeModel.findOne({ category });

    if (!attributeDoc || !attributeDoc.data.has(key)) {
      return res.status(404).json({ message: 'Category or list not found' });
    }

    const list = attributeDoc.data.get(key);
    // Filtering logic capable of handling objects and specific parents
    const newList = list.filter(item => {
      const itemValue = typeof item === 'string' ? item : item.value;
      const itemParent = typeof item === 'string' ? undefined : item.parent;

      if (itemValue !== value) return true; // Keep if value doesn't match

      // If value matches, check if parent matches specifically
      // If the request has 'parent' (e.g. 'Core i5'), we delete only if itemParent === 'Core i5'
      if (req.body.parent !== undefined) {
        return itemParent !== req.body.parent;
      }

      // If request has NO parent (legacy delete or targeting legacy string), we delete if itemParent is also undefined
      // If we want to support deleting ALL occurrences regardless of parent when parent is not provided, we just return false here.
      // But safer is to only delete legacy strings if no parent provided.
      // However, existing frontal logic might have relied on simple value match.
      // Let's assume strictness: if parent is not provided in request, we delete items that HAVE NO parent (strings or objects with no parent).
      return itemParent !== undefined;
    });

    if (newList.length === list.length) {
      return res.status(404).json({ message: 'Value not found in list (or parent mismatch)' });
    }

    attributeDoc.data.set(key, newList);
    attributeDoc.markModified('data');
    await attributeDoc.save();

    res.status(200).json({
      message: 'Value removed successfully',
      attribute: attributeDoc
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing value from category' });
  }
};

// Deprecated or unused endpoints can be kept as stubs or removed
export const getAttributes = async (req, res) => {
  // Return all categories
  try {
    const docs = await AttributeModel.find({});
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all attributes' });
  }
};

export const createAttribute = async (req, res) => {
  // Redirect to addValue logic if called, or deprecate
  res.status(410).json({ message: 'Endpoint deprecated. Use /add-value' });
};

export const updateAttribute = async (req, res) => {
  res.status(410).json({ message: 'Endpoint deprecated.' });
};

export const deleteAttribute = async (req, res) => {
  res.status(410).json({ message: 'Endpoint deprecated. Use /remove-value' });
};
