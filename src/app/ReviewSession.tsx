'use client';

import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestResponse } from '@supabase/supabase-js';
import Button from './Button';
import { Piece, BoardState } from './ChessBoard';

interface ChessMove {
    id: number;
    order_in_line: number;
    fen: string;
    lines_id: number;
  }

const ReviewSession: React.FC = () => {
    const fenToBoard = (fen: string): Piece[][] => {
        const parts = fen.split(" ");
        const layout = parts[0];
        let rankIndex = 0;
        let fileIndex = 0;
        const newBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
    
        for (const char of layout) {
            if (char === "/") {
                rankIndex++;
                fileIndex = 0;
                continue;
            }
    
            if (isNaN(Number(char))) {
                const piece = char.toLowerCase();
                const color = char === char.toLowerCase() ? 'd' : 'l';
                newBoard[7 - rankIndex][fileIndex] = { piece:piece, color:color };
                fileIndex++;
            } else {
                fileIndex += Number(char);
            }
        }
        return newBoard;
    }

    const [currentLine, setCurrentLine] = useState<Piece[][][]>([Array.from({ length: 8 }, () => Array(8).fill(null))]);

    useEffect(() => {
        const signIn = async () => {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: process.env.TEST_USERNAME!,
            password: process.env.TEST_PASSWORD!,
          })
    
          if (error) {
            console.error('Error signing in:', error.message)
          }
        }
    
        signIn()
      }, []
    )
    
    useEffect(() => {
        const fetchData = async () => {
          const response: PostgrestResponse<ChessMove> = await supabaseClient
            .from('moves')
            .select('fen')
      
          if (response.error) console.error('error', response.error)
          else if (response.data) unpackMoves(response.data)
        }
        
        fetchData()
      }, [])
    
    const unpackMoves = (moves: ChessMove[]) => {
        const updatedLine = []
        for (let move of moves) {
            updatedLine.push(fenToBoard(move.fen));
        }
        setCurrentLine(updatedLine);
    }

    useEffect(() => {
        console.log('Current line from ReviewSession perspective: ', currentLine);
    }, [currentLine]);
    

    return (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <ChessBoard
            currentLine={currentLine}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button>{'<'}</Button>
            <Button>{'>'}</Button>
          </div>
        </div>
    )
}

export default ReviewSession;