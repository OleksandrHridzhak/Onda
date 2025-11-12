import { handleRemoveOption } from './columnMenuHandlers';

describe('columnMenuHandlers', () => {
  describe('handleRemoveOption', () => {
    let mockDispatch;
    let mockOnChangeOptions;
    let mockColumn;
    let mockState;

    beforeEach(() => {
      mockDispatch = jest.fn();
      mockOnChangeOptions = jest.fn();
      mockColumn = {
        id: 'test-column-id',
        type: 'multi-select'
      };
      mockState = {
        options: ['Option 1', 'Option 2', 'Option 3'],
        optionColors: {
          'Option 1': 'blue',
          'Option 2': 'green',
          'Option 3': 'purple'
        },
        doneTags: []
      };
    });

    test('removes option from options array and passes it to onChangeOptions', () => {
      const optionToRemove = 'Option 2';
      
      handleRemoveOption(mockState, mockDispatch, mockColumn, mockOnChangeOptions, optionToRemove);

      // Verify dispatch was called with correct action
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_OPTION',
        payload: optionToRemove
      });

      // Verify onChangeOptions was called with correct parameters
      expect(mockOnChangeOptions).toHaveBeenCalledWith(
        mockColumn.id,
        ['Option 1', 'Option 3'], // filtered options
        { 'Option 1': 'blue', 'Option 3': 'purple' }, // filtered colors
        [], // doneTags unchanged
        optionToRemove // the removed option passed as 5th parameter
      );
    });

    test('removes option from doneTags array and passes it to onChangeOptions', () => {
      const optionToRemove = 'Done Tag 1';
      mockState = {
        ...mockState,
        options: ['Option 1', 'Option 2'],
        doneTags: ['Done Tag 1', 'Done Tag 2'],
        optionColors: {
          'Option 1': 'blue',
          'Option 2': 'green',
          'Done Tag 1': 'purple',
          'Done Tag 2': 'orange'
        }
      };
      
      handleRemoveOption(mockState, mockDispatch, mockColumn, mockOnChangeOptions, optionToRemove);

      // Verify onChangeOptions was called with correct parameters
      expect(mockOnChangeOptions).toHaveBeenCalledWith(
        mockColumn.id,
        ['Option 1', 'Option 2'], // options unchanged
        { 'Option 1': 'blue', 'Option 2': 'green', 'Done Tag 2': 'orange' }, // filtered colors
        ['Done Tag 2'], // filtered doneTags
        optionToRemove // the removed option passed as 5th parameter
      );
    });

    test('does nothing if option is not found in either options or doneTags', () => {
      const nonExistentOption = 'Non-Existent Option';
      
      handleRemoveOption(mockState, mockDispatch, mockColumn, mockOnChangeOptions, nonExistentOption);

      // Dispatch should still be called
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_OPTION',
        payload: nonExistentOption
      });

      // But onChangeOptions should not be called
      expect(mockOnChangeOptions).not.toHaveBeenCalled();
    });
  });
});
