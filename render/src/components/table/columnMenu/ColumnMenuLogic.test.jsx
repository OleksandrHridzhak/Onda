import { renderHook, act } from '@testing-library/react';
import { useColumnMenuLogic } from './ColumnMenuLogic';
import * as columnsDB from '../../../services/columnsDB';

// Mock the services
jest.mock('../../../services/columnsDB');
jest.mock('../hooks/useColumnOperations');

describe('useColumnMenuLogic', () => {
  describe('handleChangeOptions with tag removal', () => {
    let mockColumns;
    let mockSetColumns;
    let mockSetTableData;
    let mockUpdateProperties;

    beforeEach(() => {
      // Clear all mocks
      jest.clearAllMocks();

      // Setup mock columns
      mockColumns = [
        {
          id: 'col-1',
          type: 'multi-select',
          name: 'Tags',
          options: ['Tag1', 'Tag2', 'Tag3'],
          tagColors: { 'Tag1': 'blue', 'Tag2': 'green', 'Tag3': 'purple' }
        }
      ];

      mockSetColumns = jest.fn();
      mockSetTableData = jest.fn(fn => {
        // Call the function to test the logic
        const currentData = {
          Monday: { 'col-1': 'Tag1, Tag2' },
          Tuesday: { 'col-1': 'Tag2, Tag3' },
          Wednesday: { 'col-1': 'Tag1' },
          Thursday: { 'col-1': '' },
          Friday: { 'col-1': 'Tag3' },
          Saturday: { 'col-1': 'Tag1, Tag2, Tag3' },
          Sunday: { 'col-1': 'Tag2' }
        };
        return fn(currentData);
      });

      mockUpdateProperties = jest.fn().mockResolvedValue({ status: 'Success' });

      // Mock useColumnOperations
      const { useColumnOperations } = require('../hooks/useColumnOperations');
      useColumnOperations.mockReturnValue({
        updateProperties: mockUpdateProperties,
        clearColumn: jest.fn()
      });
    });

    test('removes tag from all cell data when removedOption is provided', () => {
      const { result } = renderHook(() =>
        useColumnMenuLogic(mockColumns, mockSetColumns, mockSetTableData)
      );

      act(() => {
        result.current.handleChangeOptions(
          'col-1',
          ['Tag1', 'Tag3'], // Tag2 removed from options
          { 'Tag1': 'blue', 'Tag3': 'purple' },
          [],
          'Tag2' // removed option
        );
      });

      // Verify setTableData was called
      expect(mockSetTableData).toHaveBeenCalled();

      // Get the function passed to setTableData
      const updateFunction = mockSetTableData.mock.calls[0][0];
      const mockData = {
        Monday: { 'col-1': 'Tag1, Tag2' },
        Tuesday: { 'col-1': 'Tag2, Tag3' },
        Wednesday: { 'col-1': 'Tag1' },
        Thursday: { 'col-1': '' },
        Friday: { 'col-1': 'Tag3' },
        Saturday: { 'col-1': 'Tag1, Tag2, Tag3' },
        Sunday: { 'col-1': 'Tag2' }
      };

      const result = updateFunction(mockData);

      // Verify Tag2 was removed from all cells
      expect(result.Monday['col-1']).toBe('Tag1');
      expect(result.Tuesday['col-1']).toBe('Tag3');
      expect(result.Wednesday['col-1']).toBe('Tag1');
      expect(result.Thursday['col-1']).toBe('');
      expect(result.Friday['col-1']).toBe('Tag3');
      expect(result.Saturday['col-1']).toBe('Tag1, Tag3');
      expect(result.Sunday['col-1']).toBe('');

      // Verify updateProperties was called
      expect(mockUpdateProperties).toHaveBeenCalledWith('col-1', {
        Options: ['Tag1', 'Tag3'],
        TagColors: { 'Tag1': 'blue', 'Tag3': 'purple' },
        DoneTags: []
      });
    });

    test('does not clean cell data when removedOption is null', () => {
      const { result } = renderHook(() =>
        useColumnMenuLogic(mockColumns, mockSetColumns, mockSetTableData)
      );

      act(() => {
        result.current.handleChangeOptions(
          'col-1',
          ['Tag1', 'Tag2', 'Tag3', 'Tag4'], // Tag4 added
          { 'Tag1': 'blue', 'Tag2': 'green', 'Tag3': 'purple', 'Tag4': 'orange' },
          [],
          null // no removed option
        );
      });

      // setTableData should not be called when no option is removed
      expect(mockSetTableData).not.toHaveBeenCalled();

      // updateProperties should still be called
      expect(mockUpdateProperties).toHaveBeenCalledWith('col-1', {
        Options: ['Tag1', 'Tag2', 'Tag3', 'Tag4'],
        TagColors: { 'Tag1': 'blue', 'Tag2': 'green', 'Tag3': 'purple', 'Tag4': 'orange' },
        DoneTags: []
      });
    });

    test('only cleans data for multi-select and multicheckbox columns', () => {
      // Setup columns with different types
      const mixedColumns = [
        { id: 'col-1', type: 'multi-select', options: ['Tag1', 'Tag2'] },
        { id: 'col-2', type: 'multicheckbox', options: ['Option1', 'Option2'] },
        { id: 'col-3', type: 'text', options: [] }
      ];

      const { result } = renderHook(() =>
        useColumnMenuLogic(mixedColumns, mockSetColumns, mockSetTableData)
      );

      // Try to remove from a text column - should not clean data
      act(() => {
        result.current.handleChangeOptions(
          'col-3',
          [],
          {},
          [],
          'SomeOption'
        );
      });

      expect(mockSetTableData).not.toHaveBeenCalled();

      // Reset mock
      mockSetTableData.mockClear();

      // Try to remove from multi-select column - should clean data
      act(() => {
        result.current.handleChangeOptions(
          'col-1',
          ['Tag1'],
          { 'Tag1': 'blue' },
          [],
          'Tag2'
        );
      });

      expect(mockSetTableData).toHaveBeenCalled();
    });
  });
});
