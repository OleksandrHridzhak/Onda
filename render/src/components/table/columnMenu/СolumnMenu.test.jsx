import { render, screen } from '@testing-library/react';
import ColumnMenu from './ColumnMenu';
import { TableProvider } from '../contexts/TableContext';

const defaultProps = {
  column: {
    id: '1',
    name: 'Test Column',
    emojiIcon: 'star',
    description: '',
    nameVisible: true,
    options: [],
    doneTags: [],
    tagColors: {},
    checkboxColor: '',
    type: 'text',
    width: 200,
  },
  onClose: jest.fn(),
  canMoveUp: true,
  canMoveDown: true,
};

const mockContextValue = {
  handleRename: jest.fn(),
  handleDeleteColumn: jest.fn(),
  handleClearColumn: jest.fn(),
  handleChangeIcon: jest.fn(),
  handleChangeDescription: jest.fn(),
  handleToggleTitleVisibility: jest.fn(),
  handleChangeOptions: jest.fn(),
  handleChangeCheckboxColor: jest.fn(),
  handleMoveColumn: jest.fn(),
  handleChangeWidth: jest.fn(),
  handleCellChange: jest.fn(),
  columns: [],
  tableData: {},
};

describe('ColumnMenu', () => {
  test('renders with column name and close button', () => {
    render(
      <TableProvider value={mockContextValue}>
        <ColumnMenu {...defaultProps} />
      </TableProvider>,
    );

    // перевірка заголовку
    expect(screen.getByText('Column Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Column')).toBeInTheDocument();

    // перевірка кнопки закриття
    expect(
      screen.getByRole('button', { name: /close column settings/i }),
    ).toBeInTheDocument();
  });
});
